<template>
    <div v-if="errorCode == 1">
        No Such Calendar
    </div>
    <div v-if="errorCode == 2">
        Could not create new calendar, try again!
    </div>
</template>

<script>
export default {
    name: "NotFound",
    data(){
        return {
            errorCode: 0,
        }
    },
    created(){
        this.errorCode = this.$route.query.id
    },
}
</script>