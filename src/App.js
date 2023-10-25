import React, { useState, useLayoutEffect }from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles';
import wordsToNumbers from 'words-to-numbers';

const alanKey = '08b8e66ba04ed4fc28230d5981b653b32e956eca572e1d8b807a3e2338fdd0dc/stage';

function App() {
  const [newsArticles, setNewsArticles ] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();

  useLayoutEffect(() => {
    function updateScreen(time) {
    alanBtn({
      key: alanKey,
      onCommand: ( { command, articles, number }) => {
        if(command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if(command === 'highlight'){
            setActiveArticle((prevActive) => prevActive + 1);
        } else if(command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers(number, {fuzzy: true}) : number;
          const article = articles[parsedNumber - 1];
          
          if(parsedNumber > 20){
            alanBtn().playText('Please try that again.');
          } else if(article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          }
        }
      }
    })
  }
  requestAnimationFrame(updateScreen);
    
  }, []);

  return (
    <div>
         <div className={classes.logoContainer}>
           <img src="https://kashmirrays.com/wp-content/uploads/2021/12/%D0%BF%D0%B5%D1%87%D0%B0%D1%82%D1%8C-breaking-news-logo-background-tv-broadcasting-banner-vector-illustration-204517466-1.jpg" className={classes.newsLogo} alt="News API logo" />
         </div>
         <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}

export default App;
