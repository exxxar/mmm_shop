// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Config from '@ioc:Adonis/Core/Config'
import {schema} from '@ioc:Adonis/Core/Validator'
import TelegramBot from "node-telegram-bot-api";
import Application from '@ioc:Adonis/Core/Application'
import fs from "node:fs";

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
        photos.push({
          type: "photo",
          media: fs.createReadStream(Application.tmpPath('uploads') + "/" + image.clientName
        });
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
      await bot.sendMessage(chatId, ads);
      if (photos.length > 1)
        bot.sendMediaGroup(chatId, photos);
      else if (photos.length === 1) {
        bot.sendPhoto(chatId, photos[0].media)
      }


    } catch (error) {
      response.badRequest(error.messages)
    }
  }


}
