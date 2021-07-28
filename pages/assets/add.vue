<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast" labelAlign="right"
			labelWidth="80">
			<uni-forms-item name="name" label="账户名称" required>
				<uni-easyinput placeholder="请输入" v-model="formData.name" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="amount" label="账户余额" required>
				<uni-easyinput placeholder="请输入" v-model="formData.amount" type="digit"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="账户类型" required>
				<picker mode="selector" :range="accountTypes" range-key="name" @change="accountTypeChange">
					<view class="picker-value">{{type.name}}</view>
				</picker>
			</uni-forms-item>
			<uni-forms-item name="remarks" label="备注">
				<uni-easyinput placeholder="请输入" type="textarea" v-model="formData.remarks" trim="both"></uni-easyinput>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/account.js';

	const db = uniCloud.database();
	const accountDB = 'account';
	const typesDB = 'types'

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				result[key] = validator[key]
			}
		}
		return result
	}
	export default {
		data() {
			const formData = {
				name: '',
				amount: '',
				remarks: ''
			}
			return {
				userId: '',
				formData,
				type: {
					name: ''
				},
				accountTypes: [],
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.userId = getApp().globalData.userId
			this.$refs.form.setRules(this.rules)
			this.getAccountTypes()
		},
		methods: {
			getAccountTypes() {
				db.collection(typesDB).where('classify == "accountType"').get().then(res => {
					this.accountTypes = res.result.data
					this.type = this.accountTypes[0]
				}).catch(() => {
					uni.showToast({
						title: "账户类型获取失败",
						icon: "none"
					})
				})
			},
			accountTypeChange(event) {
				this.type = this.accountTypes[Number(event.detail.value)]
			},
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					this.submitForm(res)
				}).catch(() => {
					uni.hideLoading()
				})
			},
			submitForm() {
				const time = new Date().getTime();
				const params = {
					userId: this.userId,
					name: this.formData.name,
					amount: Number(this.formData.amount),
					remarks: this.formData.remarks,
					lastAmount: 0,
					percentage: 0,
					isProfit: true,
					type: this.type,
					createDate: time,
					updateDate: time
				}
				console.log(params);
				// 使用 clientDB 提交数据
				db.collection(accountDB).add(params).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() =>
						uni.switchTab({
							url: "/pages/assets/index"
						}), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.uni-container {
		padding: 15px;
		background-color: #fff;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 100%;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;

	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
	}

	.uni-button-group {
		margin-top: 50px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
	}

	.uni-button {
		width: 188px;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		line-height: 1;
		margin: 0;
	}

	.picker-value {
		padding-left: 10px;
		width: 100%;
		min-height: 36px;
		display: flex;
		align-items: center;
	}
</style>
