import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import * as Handlebars from 'handlebars';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as moment from 'moment';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(19429);

  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views/pages'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', '/views/templates'));

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  loadHelpers();
}

bootstrap();

function loadHelpers() {
  hbs.registerHelper('ifEquals', function (arg1: any, arg2: any, options: any) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper('hexToBase64', function (hexString: any) {
    if (!hexString) return '';
    return Buffer.from(hexString, 'binary').toString('base64');
  });

  hbs.registerHelper('eq', function (arg1: any, arg2: any, options: any) {
    return arg1 == arg2;
  });

  hbs.registerHelper('neq', function (arg1: any, arg2: any, options: any) {
    return arg1 != arg2;
  });

  hbs.registerHelper('and', function (arg1: any, arg2: any, options: any) {
    return arg1 === true && arg2 === true;
  });

  hbs.registerHelper('mod', function (n: number, m: number) {
    return n % m;
  });

  hbs.registerHelper('chunk', function (context, chunkSize, options) {
    let ret = '';
    for (let i = 0; i < context.length; i += chunkSize) {
      ret += options.fn(context.slice(i, i + chunkSize));
    }
    return ret;
  });

  hbs.registerHelper('multiply', function (a, b) {
    return a * b;
  });

  hbs.registerHelper('less', function (a, b) {
    return a < b;
  });

  hbs.registerHelper('more', function (a, b) {
    return a > b;
  });

  hbs.registerHelper('add', function (a: number, b: number) {
    return +a + +b;
  });

  hbs.registerHelper('subtract', function (a: number, b: number) {
    return +a - +b;
  });

  hbs.registerHelper('formatDate', (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  });

  hbs.registerHelper('gt', (a, b) => a > b);
  hbs.registerHelper('lt', (a, b) => a < b);

  hbs.registerHelper(
    'formatContent',
    function (content: string, signs: any[], markings: any[], chapters: any[]) {
      let currentType = null;
      const processParagraph = (paragraph: string) => {
        const isBold = paragraph.endsWith(':');
        const isItalic = paragraph.includes('КМ');
        //const termRegex = /^([А-Яа-яЇїІіЄєҐґ \-]+) [—\-] (.+)$/;
        //paragraph = paragraph.replace(termRegex, '<strong>$1</strong> — $2');

        const words = paragraph.split(' ');

        for (let i = 0; i < words.length; i++) {
          let word = words[i];
          word = word.replace(/[.,;:?!()]+$/, '');

          if (word.match(/[Зз]нак?|[Тт]абл?/)) {
            currentType = 'sign';
          } else if (word.match(/[Рр]озмітк?|[Сс]муг?|[Лл]іні?/)) {
            currentType = 'marking';
          } else if (word.match(/[Рр]озділ([ауиів]?)/)) {
            currentType = 'chapter';
          } else if (word.match(/пункт?/)) {
            currentType = 'subchapter';
          }

          if (currentType && /^\d+(\.\d+)*$/.test(word)) {
            if (currentType === 'sign') {
              const signData = signs.find((item) => item.item_id === word);
              if (signData) {
                const signImage = `<img src="data:image/png;base64,${Buffer.from(signData.item_image, 'binary').toString('base64')}" alt="${signData.item_name}" style="width: 20px; vertical-align: middle;">`;
                words[i] =
                  `<a href="/theory/road-signs/${signData.type_id}/${signData.item_id}">${word}</a> ${signImage}`;
              }
            } else if (currentType === 'marking') {
              const markingData = markings.find(
                (item) => item.item_id === word,
              );
              if (markingData) {
                const markingImage = `<img src="data:image/png;base64,${Buffer.from(markingData.item_image, 'binary').toString('base64')}"  alt="${markingData.item_name}" style="width: 20px; vertical-align: middle;">`;
                words[i] =
                  `<a href="/theory/road-markings/${markingData.type_id}/${markingData.item_id}">${word}</a> ${markingImage}`;
              }
            } else if (currentType === 'chapter' && /^\d+/.test(word)) {
              const chapterData = chapters.find(
                (item) => item.chapter_num === parseInt(word),
              );
              if (chapterData) {
                words[i] = `<a href="/theory/rules/${word}">${word}</a>`;
              }
            } else if (
              currentType === 'subchapter' &&
              /^\d+(\.\d+)+$/.test(word)
            ) {
              const chapterData = chapters.find(
                (item) => item.chapter_num === parseInt(word.split('.')[0]),
              );
              if (chapterData) {
                words[i] =
                  `<a href="/theory/rules/${word.split('.')[0]}">${word}</a>`;
              }
            }
          }
        }
        if (isBold) return `<b>` + words.join(' ') + `</b>`;
        if (isItalic) return `<i>` + words.join(' ') + `</i>`;
        return words.join(' ');
      };

      if (content.match(/^[абвгґдеєжзиіїйклмнопрстуфхцчшщьюя]\)/)) {
        return new Handlebars.SafeString(
          `<ul>${content
            .split('\n')
            .map(
              (item) =>
                `<li><strong>${item.split('—')[0]}</strong>${item.split('—')[1]}</li>`,
            )
            .join('')}</ul>`,
        );
      }

      return new Handlebars.SafeString(
        content
          .split('\n')
          .map((paragraph) => `<p>${processParagraph(paragraph)}</p>`)
          .join(''),
      );
    },
  );
}
