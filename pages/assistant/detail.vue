<template>
	<view>
		<view v-if="detailData" class="steps">
			<view class="steps__text-container">
				<view class="steps__text" v-for="item in detailLists" :key="item.id"
					:class="{'active':item.isComplete}">xxx</view>
			</view>
			<view class="steps__container">
				<view class="steps__line-item" v-for="item in detailLists" :key="item.id">
					<view class="steps__line-item--before" :class="{'active':item.isComplete}"></view>
					<view class="steps__line-item--circle" v-if="!item.isComplete"></view>
					<view class="steps__line-item--check" v-else>
						<uni-icons type="checkbox-filled" color="#67C23A" size="14"></uni-icons>
					</view>
					<view class="steps__line-item--after" :class="{'active':item.isComplete}"></view>
				</view>
			</view>
		</view>
		<no-data v-if="!detailData"></no-data>
		<uni-popup ref="popup" type="bottom" :mask-click="false">
			<view style="background-color: #ffffff;padding: 15px;border-radius: 2px 2px 0 0;">
				<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast"
					labelAlign="right" labelWidth="85">
					<uni-forms-item v-if="opType === 1" name="buyAveragePrice" label="买入均价" required>
						<uni-easyinput placeholder="请输入" v-model="formData.buyAveragePrice" type="digit">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 1" name="buyAmount" label="买入金额" required>
						<uni-easyinput placeholder="请输入" v-model="formData.buyAmount" type="digit"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 0" name="sellAveragePrice" label="卖出均价" required>
						<uni-easyinput placeholder="请输入" v-model="formData.sellAveragePrice" type="digit">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 0" name="sellAmount" label="卖出金额" required>
						<uni-easyinput placeholder="请输入" v-model="formData.sellAmount" type="digit"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 1" name="targetPercent" label="止损百分比" required>
						<uni-easyinput placeholder="请输入" v-model="formData.targetPercent" type="digit"></uni-easyinput>
					</uni-forms-item>
					<view style="text-align: center;">
						<button size="mini" style="width: 40%;margin-right: 10px;" @click="cancle">取消</button>
						<button size="mini" style="width: 40%;" type="primary" @click="submit">提交</button>
					</view>
				</uni-forms>
			</view>
		</uni-popup>
		<uni-fab :horizontal="'right'" :popMenu="false" @fabClick="fabClick"></uni-fab>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/planDetails.js';
	const db = uniCloud.database();
	const dbCmd = db.command
	const planDetailsDB = 'planDetails';

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
				buyAveragePrice: '',
				buyAmount: '',
				sellAveragePrice: '',
				sellAmount: '',
				targetPercent: 10
			}
			return {
				planId: '',
				opType: 1, // 0卖出 1买入
				formData,
				detailData: '',
				detailLists: [{
					isComplete: false
				}],
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onLoad(op) {
			console.log(op);
			this.planId = op.id;
		},
		onShow() {
			this.getPlanDetails()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			getPlanDetails() {
				db.collection(planDetailsDB).where({
					planId: dbCmd.eq(this.planId)
				}).get().then(res => {
					if (res.result.data.length) {
						this.detailData = res.result.data[0]
						console.log(this.detailData);
					}
				})
			},
			fabClick() {
				this.$refs.popup.open()
			},
			cancle() {
				this.$refs.popup.close()
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
				// 使用 clientDB 提交数据
				db.collection(planDetailsDB).add(this.getParams()).then((res) => {
					console.log(111, res);
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					this.resetForm();
					this.cancle();
					setTimeout(() => {
						this.getPlanDetails();
					}, 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			getParams() {
				const time = new Date().getTime();
				const params = {
					planId: this.planId,
					buyAveragePrice: Number(this.formData.buyAveragePrice),
					buyAmount: Number(this.formData.buyAmount),
					sellAveragePrice: Number(this.formData.sellAveragePrice),
					sellAmount: Number(this.formData.sellAmount),
					targetPercent: Number(this.formData.targetPercent),
					amount: 1,
					isProfit: true,
					updateDate: time
				}
				switch (this.opType) {
					case 0: // 卖出
						break;
					case 1: // 买入
						params.createDate = time;
						const difPrice = this.$evaluate(params.buyAveragePrice * params.targetPercent / 100);
						params.targetPrice = this.$evaluate(params.buyAveragePrice - difPrice)
						params.operationRecord = this.detailData && this.detailData.operationRecord && this.detailData
							.operationRecord.unshift(JSON.parse(JSON.stringify(params))) || [JSON.parse(JSON.stringify(
								params))]
						break;
				}
				console.log(params);
				return params;
			},
			resetForm() {
				this.formData.buyAveragePrice = '';
				this.formData.buyAmount = '';
				this.formData.sellAveragePrice = '';
				this.formData.sellAmount = '';
				this.formData.targetPercent = 10;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.steps {
		display: flex;
		flex-direction: row-reverse;

		&__text-container {
			display: flex;
			flex-direction: column;
			flex: 1;
		}

		&__container {
			display: inline-flex;
			width: 30px;
			flex-direction: column;
		}

		&__text {
			padding: 6px 0px;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #e5e5e5;
			display: flex;
			flex-direction: column;

			&.active {
				color: #67C23A;
			}
		}

		&__line-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			align-items: center;
			justify-content: center;

			&:first-child {
				.steps__line-item--before {
					background-color: transparent;
				}
			}

			&--before {
				width: 1px;
				height: 6px;
				background-color: #999;
				transform: translate(0px, -1px);

				&.active {
					background-color: #67C23A;
				}
			}

			&--circle {
				width: 5px;
				height: 5px;
				border-radius: 100px;
				background-color: #999;
				margin: 4px 0px 5px 0px;

				&.active {
					background-color: #67C23A;
				}
			}

			&--check {
				height: 14px;
				line-height: 14px;
				margin: 2px 0px;
			}

			&--after {
				width: 1px;
				background-color: #999;
				flex: 1;
				transform: translate(0px, 1px);

				&.active {
					background-color: #67C23A;
				}
			}
		}
	}
</style>
