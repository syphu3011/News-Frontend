
import { useEffect, useState } from 'react';
import React from 'react';
import NewsItem from '../../models/NewsHomeItem';
import { Link } from 'react-router-dom';
import getNews from '../../functions/getNews';
import LikeForm from './LikeForm';
const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    if (!isLoaded) {
      const rs = getNews()
      rs.then((data) => {
        if (data.statusText === 'OK') {
          setNews(data.data)
        }
      })
    }
    setIsLoaded(true)
  }, [])
  return (
    <div className="container">
      <h1>News Aggregation</h1>
      <ul>
        {news.map((newsItem) => (
          <li key={newsItem.id}>
            <h2>{newsItem.ten_bai_viet}</h2>
            <p>By {newsItem.tac_gia} on {newsItem.publishedAt}</p>
            <Link to={`/news/${newsItem.documentId}`}>Read more</Link>
            <LikeForm currentLike={newsItem.like} postId={newsItem.documentId}></LikeForm>
          </li>
        ))}
      </ul>
    </div>
  );

};

export default NewsList;
