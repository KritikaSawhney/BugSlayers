import tweepy
import google.generativeai as genai


TWITTER_CONSUMER_KEY = 'w3p1QiFo7dyf3N1KUynwoDu7y'
TWITTER_CONSUMER_SECRET = 'Jbj0BrZq5Nno87gBThutQIM9keBMX1kRs0NaFEHtGGVaXwNg68'

GEMINI_API_KEY = 'AIzaSyBA5g8knQRfgijNy3eLKAKAq6VvwwXAVV8'

def get_tweets(username, count=10):
    """Fetch recent tweets from a Twitter account"""
    auth = tweepy.OAuthHandler(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET)
    auth.set_access_token(TWITTER_CONSUMER_KEY)
    api = tweepy.API(auth)
    
    tweets = api.user_timeline(screen_name=username, 
                              count=count,
                              include_rts=False,
                              tweet_mode='extended')
    return [tweet.full_text for tweet in tweets]

def analyze_sentiment(text):
    """Analyze text sentiment using Gemini"""
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""Analyze this tweet for financial sentiment and return only one value:

    Extract the cryptocurrency mentioned in the tweet.
    Determine the sentiment:
        'bullish' if the tweet is positive about the cryptocurrency growth.
        'bearish' if the tweet is negative about the cryptocurrency decline.
        'neutral' if no clear sentiment is expressed.
        If the sentiment is 'bullish', fetch the cryptocurrency hash and return it.
        If the sentiment is 'bearish' or 'neutral', return null.
        return only the hash or null dont return anything else.
    
    Tweet: {text}
    """
    
    response = model.generate_content(prompt)
    return response.text.strip().lower()

if __name__ == "_main_":
    
    twitter_username = "elonmusk"
    num_tweets = 5
 
    tweets = get_tweets(twitter_username, num_tweets)
    

    for i, tweet in enumerate(tweets, 1):
        sentiment = analyze_sentiment(tweet)
        print(f"Tweet {i}:")
        print(tweet)
        print(f"Sentiment: {sentiment}\n{'='*50}\n")