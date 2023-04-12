// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Config from '@ioc:Adonis/Core/Config'
import {schema} from '@ioc:Adonis/Core/Validator'
import TelegramBot from "node-telegram-bot-api";
import Application from '@ioc:Adonis/Core/Application'
import fs from "node:fs";
import {Api, TelegramClient} from 'telegram';
import {StringSession} from "telegram/sessions";

export default class PostsController {

  async telegram(){

    const apiId = 28671589
    const apiHash = 'b35cc51e56481c5cc586fea60bdab9f0'
    const stringSession = ''; // leave this empty for now
    const BOT_TOKEN = Config.get("telegram.telegramBotToken"); // put your bot token here
    (async () => {
      const client = new TelegramClient(new StringSession(stringSession),
        apiId, apiHash, {connectionRetries: 5});
      await client.start({
        botAuthToken: BOT_TOKEN
      });
      console.log(client.session.save())

      const result = await client.invoke(
        new Api.messages.SendMessage({
          peer: "exxxar",
          message: "Hello there!",
          // @ts-ignore
          randomId: BigInt("-4156887774564"),
          noWebpage: true,
          noforwards: true,
          //scheduleDate: 43,
          sendAs: "exxxar",
        })
      );
      console.log(result); // prints the result
    })();

  }

  async test(){
    await this.telegram();
  }

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
          // @ts-ignore
          type: "photo",
          // @ts-ignore
          caption: "Изображение " + (image + 1),
          // @ts-ignore
          media: fs.createReadStream(Application.tmpPath('uploads') + "/" + image.clientName),
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
      if (photos.length == 0)
        await bot.sendMessage(chatId, ads);

      if (photos.length > 1) {
        let message = await bot.sendMessage(chatId, ads);

        //photos[0].caption = ads//.slice(0,1024)
        bot.sendMediaGroup(chatId, photos, {
          reply_to_message_id: message.message_id
        })
      } else if (photos.length === 1) {
        // @ts-ignore
        bot.sendPhoto(chatId, photos[0].media, {
          caption: ads
        })
      }



    } catch (error) {
      response.badRequest(error.messages)
    }
  }


}
