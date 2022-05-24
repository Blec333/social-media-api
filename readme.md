# Portfolio

## Description

This social media api is setup using Mongo DB wrapped by Mongoose.  All necessary CRUD routes have been organized to manipulate DB information for Users, Thoughts & Reactions.


## Links

[Click to view the deployed application](https://blec-social-media-api.herokuapp.com/)

[Click to view the portfolio repository](https://github.com/Blec333/social-media-api)

[Click to view the video](https://drive.google.com/file/d/1-hOs36HAfjZ06oN_9rn4DEVwiiVi8LHZ/view?usp=sharing)

## Table of contents


- [Technologies Employed](#technologies-employed)
- [Key Functions](#key-functions)
- [Final Product](#final-product)
- [License](#license)
- [Contact/Questions](#questions)


## Technologies Employed


| Techlogy             | Implementation/Use       |
| -------------------- | ------------------------ |
| Node.js              | JavaScript runtime       |
| Node Package Manager | Manage node packages     |
| Express.js           | Web framework            |
| MongoDB & Mongoose   | ORM                      |
| Heroku               | Deployment               |


## Key Functionality

* Reactions need not be a model.
```javascript
const { Schema, Types } = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      default: 'Unnamed reaction',
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a'),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);



module.exports = reactionSchema;
```


## Final Product

<img title="image" alt="Style Showcase Page Screenshot" src="./assets/social-media-api-gif.gif">



## License

This software is licensed under the MIT [LICENSE](./LICENSE)

MIT License

Copyright (c) 2022 Brennan LeClair

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



## Questions?

Please visit

[Brennan (blec333)](https://github.com/Blec333)



### Acknowledgements

©Brennan LeClair
