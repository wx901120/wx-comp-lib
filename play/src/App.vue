<template>
    <div class="play-container">
        ab
        <!-- 这个el-button组件是通过在vite.config.ts中自动导入的，所以可以直接使用 -->
        <el-button>test</el-button>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
html,
body {
    width: 100vw;
    height: 100vh;
    margin: 0;

    #play {
        height: 100%;
        width: 100%;

        .play-container {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: blue;
        }
    }
}
</style>