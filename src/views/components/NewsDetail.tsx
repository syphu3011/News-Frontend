// components/NewsDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LikeForm from './LikeForm';
import NewsDetailItem from '../../models/NewsDetailItem';
import getNews from '../../functions/getNews';
const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoaded, setIsLoaded] = useState(false)
  const [likes, setLikes] = useState(0);
  const [news, setNews] = useState<NewsDetailItem>()
  useEffect(() => {
    if (!isLoaded) {
      getNews(id).then(rs => {
        console.log(rs.data)
        setNews(rs.data)
      })
      setIsLoaded(true)
    }
  }, [id, isLoaded])




  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    ((isLoaded && news && <div className="container detail">
      <h1>{news.ten_bai_viet}</h1>
      <p>By {news.tac_gia} on {news.publishedAt}</p>
      <LikeForm postId={id ?? "1"} currentLike={news.like}></LikeForm>
      <p>{news.noi_dung}</p>
    </div>)
    ||
    (!isLoaded && <div>News is being loaded</div>)
    ||
    (<div>Not Found</div>)
  )
  );
};

export default NewsDetail;
