// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Config from '@ioc:Adonis/Core/Config'
import {schema} from '@ioc:Adonis/Core/Validator'
import TelegramBot from "node-telegram-bot-api";
import Application from '@ioc:Adonis/Core/Application'
import fs from "node:fs";
import { VK } from 'vk-io';
const vk = new VK({
  // token: process.env.VK_TOKEN
  token: Config.get("vk.vkToken")
});


async function makeVKPost() {
  // const response = await vk.api.wall.get({
  //   owner_id: 1
  // });

  const response = await vk.api.wall.post({
    owner_id: -81405266,
    from_group: 0,
    message: 'Hello world!'
  });


  // await vk.upload.wallPhoto({
  //   source: {
  //     // value: './path/to/cat1.jpg'
  //     value: '/home/mixa/Загрузки/cola.jpeg'
  //   }
  // })

  console.log(response);
}



export default class PostsController {

  async store({request, response}) {

    const newPostSchema = schema.create({
      name: schema.string(),
      price: schema.string(),
      description: schema.string(),
      count: schema.string(),
      /*images: schema.file.nullable({
        size: '2mb',
        extnames: ['jpg', 'gif', 'png'],
      })*/
    })

    const images = request.files('images')

    let photos = [];
    if (images.length > 0)
      for (let image of images) {
        let path = Application.tmpPath('uploads')

        await image.move(path)
        // @ts-ignore
        photos.push
        (
          {
          // @ts-ignore
          type: "photo",
          // @ts-ignore
          caption: "Изображение " + (image + 1),
          // @ts-ignore
          media: fs.createReadStream
          (Application.tmpPath('uploads') + "/" + image.clientName)})
      }

    let token = Config.get("telegram.telegramBotToken")
    let chatId = Config.get("telegram.telegramChatId")


    try {
      const payload = await request.validate({schema: newPostSchema})

      let mName = payload.name;
      let mPrice = payload.price;
      let mCount = payload.count;
      let mDescription = payload.description;

      let ads = `В продажу поступил новый товар! В продаже ${mName} по отличной цене всего ${mPrice} рублей в количестве ${mCount} единиц. ${mDescription}`;

      const bot = new TelegramBot(token);
      if (photos.length == 0)
        await bot.sendMessage(chatId, ads);

      if (photos.length > 1) {
        let message = await bot.sendMessage(chatId, ads);

        //photos[0].caption = ads//.slice(0,1024)
        await bot.sendMediaGroup(chatId, photos
         , {
          reply_to_message_id: message.message_id
        }
        );

        //await bot.editMessageText(chatId, mess, 'blablabla');

        // await bot.editMessageText('blablabla', {
        //   chat_id: chatId,
        //   message_id: message.message_id,
        //   parse_mode: 'HTML',
        //   disable_web_page_preview: true
        // })

      } else if (photos.length === 1) {
        // @ts-ignore
        bot.sendPhoto(chatId, photos[0].media, {
          caption: ads
        })
      }


    } catch (error) {
      response.badRequest(error.messages)
    }

    makeVKPost().catch(console.log);
  }


}
