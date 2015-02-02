# Chatapp - "HelperBot"

This is a simple Heroku / Node app that watches our local chat server and performs a handful of helpful functions. 
It began life as a push notification server for a chat app but has grown from there. The push notifications (via Websockets) are still in place but are commented out to save resources - feel free to turn them back on and deploy a new version if you prefer. 

Thanks to [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) for getting me started on Heroku. Woohoo!

## Usage

  - "#! image-url" : HelperBot will add an image tag with the image-url as the source. The url must end in gif, jpg, jpeg or png.
  - "#! cageme" : Provides a random picture of a cat with Nic Cage's face. For reasons.
  - SCRIPT-DEFENDER (passive) : prevents 'script' tags from being stored on the server. WARNING: script will execute to currently-watching users, but will be deleted almost immediately. Make sure you're refreshing your messages! 
