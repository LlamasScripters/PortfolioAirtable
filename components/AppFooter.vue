<template>
    <footer class='flex md:justify-between border-top text-menu-text font-fira_retina'>

        <!-- social icons -->
        <div class="w-9/12 flex justify-between md:justify-start">
            <span id="social-title" class="h-full flex justify-center items-center border-right px-5">
                find us in:
            </span>
            <div id="social-icons" class="flex">
                <a href="https://github.com/LlamasScripters" target="_blank"
                    class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-twitter-x" viewBox="0 0 16 16">
                        <path
                            d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                    </svg>
                </a>
                <a href="https://github.com/LlamasScripters" target="_blank" class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-linkedin" viewBox="0 0 16 16">
                        <path
                            d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                    </svg>
                </a>
                <a href="https://github.com/LlamasScripters" target="_blank"
                    class="flex md:hidden justify-center items-center">
                    <img src="/icons/social/github.svg" alt="github" />
                </a>
            </div>
        </div>

        <!-- github user -->
        <a href="https://github.com/LlamasScripters" target="_blank"
            class="hidden md:flex items-center px-5 border-left">
            @ LlamasScripters
            <img src="/icons/social/github.svg" alt="github" />
        </a>

    </footer>
</template>

<script setup>
import config from '~/developer.json';

const social = ref(config.contacts.social);
</script>

<script>
export default {
    name: 'AppFooter',
}
</script>

<style>
footer {
    height: 40px;
    min-height: 40px;
    font-size: 13px;
}

footer a:hover {
    background-color: #1e2d3d74;
}

#social-icons>a {
    border-right: 1px solid #1E2D3D;
    height: 100%;
    width: 50px;
}

#social-icons>a>img {
    width: 1.25rem;
    /* 20px */
    height: 1.25rem;
    /* 20px */
    margin: auto;
    opacity: 0.4;
}

footer>a>img {
    width: 1.25rem;
    /* 20px */
    height: 1.25rem;
    /* 20px */
    margin-left: 0.5rem;
    /* 8px */
}

#social-icons>a:hover img {
    opacity: 1;
}

@media (max-width: 768px) {

    #social-title {
        border-right: none;
    }

    #social-icons>a {
        border-right: none;
        border-left: 1px solid #1E2D3D;
    }

    #social-icons>a>img {
        width: 1.5rem;
        /* 20px */
        height: 1.5rem;
        /* 20px */
    }
}
</style>