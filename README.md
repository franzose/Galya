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
| slideWidth | ширина слайда (большого изображения), пикс | 725
| showCaptions | показывать/не показывать описание слайдов | false
| headingLevel | уровень заголовка (h1-h6) в подписи к слайду | 4
| captionContentTag | тег, обрамляющий текст подписи к слайду | p
| thumbnailWidth | ширина превьюшки, пикс | 110
