import React, { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import useSocket from '../../hooks/useSocket';
import Cookies from 'js-cookie';
import { GetEnableLikeContext } from '../provider/EnableLikeContext';


interface LikeFormProps {
  postId: string; // Đặt kiểu cho postId
  currentLike: number
}

const LikeForm: React.FC<LikeFormProps> = ({ postId, currentLike }) => {
  // const [token, setToken] = useState("");
  const { likes, setLikes, sendLike, socket, isChange } = useSocket();
  const [liked, setLiked] = useState(false);
  const [isSending, setIsSending] = useState(false)
  const enabledLike = GetEnableLikeContext()
  const { executeRecaptcha } = useGoogleReCaptcha();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return
    setIsSending(true)
    if (!enabledLike)
      return
    if (!executeRecaptcha) {
      alert('Please complete the reCAPTCHA.');
      return;
    }
    const token = await executeRecaptcha('like_action');
    const currentLikes = likes[postId] ?? currentLike;
    const newLikeCount = liked ? currentLikes - 1 : currentLikes + 1;
    let isLiked = ''

    console.log(liked)
    await sendLike(postId, token, liked ? 'true' : '', (like: number) => {
      setIsSending(false)
      const c_js_liked = JSON.parse(Cookies.get('liked') ?? '{}')
      if (c_js_liked[postId] === 'true') {
        setLiked(false);
      }
      else {
        setLiked(true)
      }
      if (like > -1) {
        likes[postId] = like
        setLikes(likes)
        if (c_js_liked[postId] === 'true') {
          c_js_liked[postId] = 'false'
        }
        else {
          c_js_liked[postId] = 'true'
        }
        Cookies.set('liked', JSON.stringify(c_js_liked))
      }

    });

  };

  useEffect(() => {
    const c_js_liked = JSON.parse(Cookies.get('liked') ?? '{}')
    if (c_js_liked[postId] === 'true') {
      setLiked(true);
    }
    else {
      setLiked(false)
    }

  }, [postId, likes]);
  const render = () => {
    if (executeRecaptcha) {
      return <><button type="submit" className='like-button'>
        {!liked ? 'Thích' : 'Bỏ thích'} ({likes[postId] ?? currentLike})
      </button>
    </>
    }
    return <div>Đang tải...</div>
  }
  return (
    <form onSubmit={handleSubmit}>
      {(enabledLike &&
      <>
      {render()}

      </>)
      ||
      <button style={{backgroundColor: '#cccccc'}} className='like-button' >
        {!liked ? 'Thích' : 'Bỏ thích'} ({likes[postId] ?? currentLike})
      </button>
      }
    </form>
  );
};

export default LikeForm;
