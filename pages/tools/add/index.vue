<template>
	<view class="add">
		<uni-forms label-align="right" :modelValue="form" ref="form" :rules="rules">
			<uni-forms-item label="名称" name="name" required>
				<uni-easyinput type="text" v-model="form.name" placeholder="请输入名称" />
			</uni-forms-item>
			<uni-forms-item label="字段" name="field" required>
				<uni-easyinput type="text" v-model="form.field" placeholder="请输入字段" />
			</uni-forms-item>
			<button @click="submit">保 存</button>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					field: ''
				},
				rules: {
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入名称'
							},
							{
								maxLength: 6,
								errorMessage: '名称长度不超过 {maxLength} 个字符'
							}
						],
						validateTrigger: 'bind'
					},
					field: {
						rules: [{
								required: true,
								errorMessage: '请输入字段'
							},
							{
								maxLength: 18,
								errorMessage: '字段长度不超过 {maxLength} 个字符'
							},
							{
								pattern: '^[a-zA-Z]+$',
								errorMessage: '字段只能输入英文字符'
							},
						],
						validateTrigger: 'bind'
					}
				}
			}
		},
		created() {},
		mounted() {},
		methods: {
			submit() {
				this.$refs.form.validate().then(res => {
					console.log('表单数据信息：', res);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.add {
		padding: 16px;
	}
</style>
