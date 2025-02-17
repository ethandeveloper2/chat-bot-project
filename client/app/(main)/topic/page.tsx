'use client'
import { useEffect, useState } from 'react';

const TopicPage = () => {
  const [topics, setTopics] = useState([]);
  const fetchTopic = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/topic`);
      const data = await response.json();
      console.log(data);
      if (data) {
        setTopics(data)
      }

    } catch (error) {

    }
    


  }
  useEffect(() => {
    fetchTopic();
  }, [])
  return ( <div>
    {topics.map((topic, index) => (<div key={topic.id}>{topic.name}</div>))}

  </div> );
}
 
export default TopicPage;