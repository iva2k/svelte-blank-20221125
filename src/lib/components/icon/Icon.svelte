<script lang="ts">
  // From https://stackoverflow.com/a/66135688/2694949
  // See https://stackoverflow.com/questions/66069647/best-way-to-import-svg-icons-into-a-svelte-app

  // TODO: Implement and use as assets organizer
  // Instead of an array, maybe use an object with the icon names as the keys, so you don't have to do a find each time an icon is rendered. – @EnricoBorba
  //    icons = {'save': {box:24, svg: '...'}, 'trash': {...}} and then displayIcon = icons[name]
  // You can make SVG images responsive via the preserveAspectRatio and viewBox attributes: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio – @peterhil
  // Everything you need to know about scaling SVG images: https://css-tricks.com/scale-svg/ – @peterhil
  // This is great. One improvement I made is to keep the svg files in $lib/assets/... but import the raw svg text like so: https://github.com/sveltejs/kit/discussions/4857#discussioncomment-2720434. Then set the svg:  value in the map to that imported raw text. This still lets you open those files in a viewer and see what they look like. – @kevlar
  // Can also use: import SearchIcon from '$lib/icon/search.svg?raw'; {@html SearchIcon} - @BobSiefkes

  export let name: keyof typeof icons;
  export let width = '1rem';
  export let height = '1rem';
  export let focusable: string | number | null | undefined = undefined;
  let icons = {
    delete: {
      box: 32,
      svg: `<path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"></path>`
    }
  } as const;
  let displayIcon = icons[name];
</script>

<svg
  class={$$props.class}
  {focusable}
  {width}
  {height}
  viewBox="0 0 {displayIcon.box} {displayIcon.box}"
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html displayIcon.svg}
</svg>
