<template>
<img @load="$emit('imageLoaded')" :src="fullSize" :sizes="`(max-width: 600px) ${srcset.sizes}`" :srcset="srcset.imgSrc" :alt="image.alt" :class="classList" />
</template>

<script>
export default {
    props: ['classList', 'image'],
    computed: {
        fullSize() {
            const img = Object.keys(this.image.sizes).map(e => this.image.sizes[e])
            const size = Object.keys(img).length - 1
            return img[size]?.source_url
        },
        srcset() {
            let srcsetValues = []
            let sizes = []
            const img = Object.keys(this.image.sizes).map(e => this.image.sizes[e])
            img.forEach(size => {
                srcsetValues.push(size.source_url + ' ' + size.width + 'w')
                sizes.push(size.width + 'px')
            });
            return { imgSrc: srcsetValues.join(', '), sizes: sizes.join(', ') }
        }
    }
}
</script>
