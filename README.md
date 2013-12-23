# Galya the Aunt.

_Galya is a diminutive form of the Russian name Galina. I chose this name because of the funny consonance with the word ‘gallery’._

Galya is an extremely simple inline JavaScript gallery made as a jQuery plugin.

It's easy to involve Galya into your fun. In the head section, put the following:

```html
<link rel="stylesheet" href="/path/to/galya.css">
<script src="/path/to/galya.min.js"></script>
<script>
  jQuery(function(){
    $('.your-gallery').galya();
  });
</script>
```

In the body section, place your photos in the order you want and wrap them with a block element:

```html
<div class="your-gallery">
  <img src="/1.jpg" alt="Photo 1">
  <img src="/2.jpg" alt="Photo 2">
  <img src="/3.jpg" alt="Photo 3">
  <img src="/4.jpg" alt="Photo 4">
  <img src="/5.jpg" alt="Photo 5">
</div>
```

## Settings
| Key | Description | Default value
|:----:|:----------:|:--------------------:|
| autoplay | slideshow (automatic slides switching) | false |
| duration | delay of the slides switching when autoplay is on, msec | 3000 |
| pauseOnHover | pausing the slideshow when mouse enters the slide | false |
| fadeSpeed | speed of fade effect, msec | 500 |
| scrollSpeed | speed of the thumbnails scroll, msec | 250 |
| slideWidth | the large image width, px | 725
| showCaptions | show/bypass description of the slides | false
| headingLevel | heading for the description of the slide (h1-h6) | 4
| captionContentTag | caption content wrapper tag | p
| thumbnailWidth | thumbnail width, px | 110

Being simple, Galya does not impose the rules, it offers a base configuration. So, look and feel of your gallery is in your hands. In the future, there will be feature of applying custom effects on slides changing and thumbnails scrollings.

### Slides captions

By default, caption is generated from `alt` attribute of an `img` tag. So, if you want your description to differ from `alt` attribute, you just add `data-content` attribute to the `img` tag with the description you want:

```html
<div class="your-gallery">
  <img src="/1.jpg" alt="Photo 1" data-content="Long photo description 1">
  <img src="/2.jpg" alt="Photo 2" data-content="Long photo description 2">
  <img src="/3.jpg" alt="Photo 3" data-content="Long photo description 3">
  <img src="/4.jpg" alt="Photo 4" data-content="Long photo description 4">
  <img src="/5.jpg" alt="Photo 5" data-content="Long photo description 5">
</div>
```

Also you can add heading to your caption doing as following:

```html
<div class="your-gallery">
  <img src="/1.jpg" alt="Photo 1" data-title="Title 1" data-content="Long photo description 1">
  <img src="/2.jpg" alt="Photo 2" data-title="Title 2" data-content="Long photo description 2">
  <img src="/3.jpg" alt="Photo 3" data-title="Title 3" data-content="Long photo description 3">
  <img src="/4.jpg" alt="Photo 4" data-title="Title 4" data-content="Long photo description 4">
  <img src="/5.jpg" alt="Photo 5" data-title="Title 5" data-content="Long photo description 5">
</div>
```

Notice that, by default, caption rendering is disabled by `showCaptions: false`.

<hr>
# Тётя Галя. Простая, как три рубля.

Тётя Галя — это сверхпростая встраиваемая фотогалерея, написанная на JavaScript и выполненная в виде плагина для jQuery.

Подключить Тётю Галю к процессу очень легко. В шапку HTML-документа добавьте следующее:

```html
<link rel="stylesheet" href="/path/to/galya.css">
<script src="/path/to/galya.min.js"></script>
<script>
  jQuery(function(){
    $('.your-gallery').galya();
  });
</script>
```

В теле документа расположите фотографии в необходимом порядке, обрамив их блочным элементом:

```html
<div class="your-gallery">
  <img src="/1.jpg" alt="Фото 1">
  <img src="/2.jpg" alt="Фото 2">
  <img src="/3.jpg" alt="Фото 3">
  <img src="/4.jpg" alt="Фото 4">
  <img src="/5.jpg" alt="Фото 5">
</div>
```

## Настройки

| Ключ | Назначение | Значение по умолчанию
|:----:|:----------:|:--------------------:|
| autoplay | слайдшоу (автоматическое переключение между слайдами) | false |
| duration | время перехода между слайдами в режиме слайдшоу, мсек | 3000 |
| pauseOnHover | остановка слайдшоу при наведении мыши на слайд | false |
| fadeSpeed | скорость затухания и появления слайдов, мсек | 500 |
| scrollSpeed | скорость прокрутки превьюшек, мсек | 250 |
| slideWidth | ширина слайда (большого изображения), пикс | 725 |
| showCaptions | показывать/не показывать описание слайдов | false |
| headingLevel | уровень заголовка (h1-h6) в подписи к слайду | 4 |
| captionContentTag | тег, обрамляющий текст подписи к слайду | p |
| thumbnailWidth | ширина превьюшки, пикс | 110 |

Будучи простой, Тётя Галя не навязывает своих правил, она предлагает базовую конфигурацию. Поэтому внешний вид фотогалереи полностью в ваших руках. В будущем появится возможность изменять эффект перехода между слайдами и при скроллинге превьюшек.

### Подписи к слайдам

По умолчанию подпись к слайду берется из атрибута `alt` у тега `img`. Если вы хотите оставить атрибут `alt` нетронутым, но при этом добавить отличное от его содержимого описание фотографии, добавьте в тег `img` атрибут `data-content`:

```html
<div class="your-gallery">
  <img src="/1.jpg" alt="Фото 1" data-content="Длинное описание фото 1">
  <img src="/2.jpg" alt="Фото 2" data-content="Длинное описание фото 2">
  <img src="/3.jpg" alt="Фото 3" data-content="Длинное описание фото 3">
  <img src="/4.jpg" alt="Фото 4" data-content="Длинное описание фото 4">
  <img src="/5.jpg" alt="Фото 5" data-content="Длинное описание фото 5">
</div>
```

К подписи также можно добавить заголовок:

```html
<div class="your-gallery">
  <img src="/1.jpg" alt="Фото 1" data-title="Заголовок фото 1" data-content="Длинное описание фото 1">
  <img src="/2.jpg" alt="Фото 2" data-title="Заголовок фото 2" data-content="Длинное описание фото 2">
  <img src="/3.jpg" alt="Фото 3" data-title="Заголовок фото 3" data-content="Длинное описание фото 3">
  <img src="/4.jpg" alt="Фото 4" data-title="Заголовок фото 4" data-content="Длинное описание фото 4">
  <img src="/5.jpg" alt="Фото 5" data-title="Заголовок фото 5" data-content="Длинное описание фото 5">
</div>
```

Обратите внимание, что по умолчанию вывод описания фотографии выключен: `showCaptions: false`. 
