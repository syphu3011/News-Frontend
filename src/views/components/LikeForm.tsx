import React, { useEffect, useState } from 'react';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from "react-google-recaptcha-v3";
import useSocket from '../../hooks/useSocket';
import Cookies from 'js-cookie';
import { GetEnableLikeContext } from '../provider/EnableLikeContext';

interface LikeFormProps {
  postId: string; // Đặt kiểu cho postId
  currentLike: number
}

const LikeForm: React.FC<LikeFormProps> = ({ postId, currentLike }) => {
  const [token, setToken] = useState("");
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const { likes, setLikes, sendLike, socket } = useSocket();
  const [liked, setLiked] = useState(false);
  const [isCaptchaReady, setIsCaptchaReady] = useState(false);
  const enabledLike = GetEnableLikeContext()


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!enabledLike)
      return
    if (!token) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    const currentLikes = likes[postId] ?? currentLike;
    const newLikeCount = liked ? currentLikes - 1 : currentLikes + 1;
    let isLiked = ''
    // Cập nhật trạng thái liked
    if (liked) {
      const c_js = JSON.parse(Cookies.get('liked') ?? '{}')
      c_js[postId] = 'false'
      isLiked = 'true'

      Cookies.set('liked', JSON.stringify(c_js))
    }
    else{
      const c_js = JSON.parse(Cookies.get('liked') ?? '{}')
      console.log(c_js)
      c_js[postId] = 'true'
      Cookies.set('liked', JSON.stringify(c_js))
    }
    setLiked(!liked);

    // Cập nhật số lượng like ngay lập tức
    setLikes((prevLikes: any) => ({
      ...prevLikes,
      [postId]: newLikeCount,
    }));

    try {
      // console.log(Cookies.get('liked'))
      // Gửi like
      await sendLike(postId, token, isLiked);

      // Emit likeUpdate để thông báo cho các client khác
      socket.emit('likeUpdate', { postId, like: newLikeCount });
    } catch (error) {
      // Nếu có lỗi xảy ra, khôi phục lại trạng thái likes
      setLikes((prevLikes: any) => ({
        ...prevLikes,
        [postId]: liked ? newLikeCount + 1 : newLikeCount - 1,
      }));
      if (!liked) {
        Cookies.remove('liked')
      }
      else {
        Cookies.set('liked', 'true')
      }
      alert('Unable to send like. Please try again.');
    }

    // Reset reCAPTCHA token after submission
    setToken('');
    setRefreshReCaptcha((r) => !r);
  };

  const onVerify = (token: any) => {
    setToken(token)
    setIsCaptchaReady(true)
  }
  useEffect(() => {
    console.log(enabledLike)
    const c_js_liked = JSON.parse(Cookies.get('liked') ?? '{}')
    // console.log(c_js_liked)
    if (c_js_liked[postId] === 'true') {
      setLiked(true);
    }
    else {
      setLiked(false)
    }
  }, [likes]);
  const render = () => {
    if (isCaptchaReady) {
      return <><button type="submit" className='like-button' disabled={!enabledLike}>
        {!liked ? 'Thích' : 'Bỏ thích'} ({likes[postId] ?? currentLike})
      </button>
        <GoogleReCaptcha
          onVerify={onVerify}
          refreshReCaptcha={refreshReCaptcha}
        /></>
    }
    return <div>Đang tải...</div>
  }
  return (
    <form onSubmit={handleSubmit}>
      {(enabledLike &&
      <>
      {render()}
        <GoogleReCaptcha
          onVerify={onVerify}
          refreshReCaptcha={refreshReCaptcha}
        />
      </>)
      ||
      <button style={{backgroundColor: '#cccccc'}} type="submit" className='like-button' >
        {!liked ? 'Thích' : 'Bỏ thích'} ({likes[postId] ?? currentLike})
      </button>
      }
    </form>
  );
};

export default LikeForm;
