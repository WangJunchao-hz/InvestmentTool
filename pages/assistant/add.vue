<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast" labelAlign="right"
			labelWidth="80">
			<uni-forms-item name="planName" label="计划名称" required>
				<uni-easyinput placeholder="请输入" v-model="formData.planName" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="计划类型" required>
				<picker mode="selector" :range="accountTypes" range-key="name" @change="accountTypeChange">
					<view class="picker-value">{{planType.name}}</view>
				</picker>
			</uni-forms-item>
			<uni-forms-item label="操作类型" required>
				<picker mode="selector" :range="operateTypes" range-key="name" @change="operateTypeChange">
					<view class="picker-value">{{operateType.name}}</view>
				</picker>
			</uni-forms-item>
			<uni-forms-item label="策略类型" required>
				<picker mode="selector" :range="strategyTypes" range-key="name" @change="strategyTypeChange">
					<view class="picker-value">{{strategyType.name}}</view>
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
	} from '../../js_sdk/validator/plan.js';

	const db = uniCloud.database();
	const planDB = 'plan';
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
				planName: '',
				remarks: ''
			}
			return {
				planId: '',
				userId: '',
				formData,
				planType: {
					name: ''
				},
				operateType: {
					name: ''
				},
				strategyType: {
					name: ''
				},
				accountTypes: [],
				operateTypes: [],
				strategyTypes: [],
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onLoad(op) {
			this.planId = op.id;
		},
		onReady() {
			this.userId = getApp().globalData.userId
			this.$refs.form.setRules(this.rules)
			this.getAccountTypes()
			if (this.planId) {
				this.getPlan();
			}
		},
		methods: {
			getPlan() {
				uni.setNavigationBarTitle({
					title: "编辑计划"
				})
				db.collection(planDB).where({
					_id: this.planId
				}).get().then(res => {
					if (res.result.data.length) {
						const planInfo = res.result.data[0];
						this.formData.planName = planInfo.planName;
						this.formData.remarks = planInfo.remarks;
						this.planType = planInfo.planType;
						this.operateType = planInfo.operateType;
						this.strategyType = planInfo.strategyType;
					}
				})
			},
			getAccountTypes() {
				db.collection(typesDB).get().then(res => {
					if (res.result && res.result.data) {
						this.accountTypes = [];
						this.operateTypes = [];
						this.strategyTypes = [];
						res.result.data.forEach(item => {
							switch (item.classify) {
								case 'accountType':
									if (item.relationType === 'floatAsset') {
										this.accountTypes.push(item)
									}
									break
								case 'operateType':
									this.operateTypes.push(item)
									break
								case 'strategyType':
									this.strategyTypes.push(item)
									break
							}
						})
						if (!this.planType.name) {
							this.planType = this.accountTypes[0];
							this.operateType = this.operateTypes[0];
							this.strategyType = this.strategyTypes[0];
						}
					}
				}).catch(() => {
					uni.showToast({
						title: "类型获取失败",
						icon: "none"
					})
				})
			},
			accountTypeChange(event) {
				this.planType = this.accountTypes[Number(event.detail.value)]
			},
			operateTypeChange(event) {
				this.operateType = this.operateTypes[Number(event.detail.value)]
			},
			strategyTypeChange(event) {
				this.strategyType = this.strategyTypes[Number(event.detail.value)]
			},
			/**
			 * 触发表单提交
			 */
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
				if (this.planId) {
					const updateParams = {
						...this.formData,
						planType: this.planType,
						operateType: this.operateType,
						strategyType: this.strategyType,
						updateDate: time
					}
					db.collection(planDB).where({
						_id: this.planId
					}).update(updateParams).then(res => {
						uni.showToast({
							icon: 'none',
							title: '更新成功'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 500)
					}).catch(err => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					const params = {
						userId: this.userId,
						...this.formData,
						planType: this.planType,
						operateType: this.operateType,
						strategyType: this.strategyType,
						isTotalProfit: true,
						preAdvise: 1,
						totalPercentage: 0,
						opType: '',
						createDate: time,
						updateDate: time
					}
					// console.log(params);
					// 使用 clientDB 提交数据
					db.collection(planDB).add(params).then((res) => {
						uni.showToast({
							icon: 'none',
							title: '新增成功'
						})
						this.getOpenerEventChannel().emit('refreshData')
						setTimeout(() =>
							uni.switchTab({
								url: "/pages/assistant/index"
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
			}
		}
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
