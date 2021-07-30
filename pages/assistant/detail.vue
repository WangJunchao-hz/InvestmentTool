<template>
	<view>
		<uni-group class="group">
			<template #title>
				<view class="group__title">
					<view style="width: 100%;display: flex;justify-content: space-between;padding-right: 15px;">
						<view>
							{{planInfo.planName}} ({{planInfo.planType.name}})
							<uni-icons type="compose" size="18px" style="margin-left: 8px;"
								@click="navJump('/pages/assistant/add')"></uni-icons>
						</view>
						<uni-icons type="trash" size="18px" @click="deletePlan"></uni-icons>
					</view>
				</view>
			</template>
			<uni-list>
				<uni-list-item class="list-item">
					<template #body>
						<view class="list-item__body">
							<view class="list-item__body-title" :class="planInfo.isTotalProfit ? 'success' : 'danger'">
								盈亏总额：{{detailData.totalProfitAdnLoss || 0}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer primary">
							<text :class="detailData.cachePercentage < 0 ? 'danger':'success'"
								style="margin-left: 18px;">
								亏损阙值: {{detailData.cachePercentage || 0}}%</text>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item class="list-item">
					<template #body>
						<view class="list-item__body">
							<view class="list-item__body-title" :class="planInfo.isOnceProfit ? 'success' : 'danger'">
								累计盈亏总额：{{detailData.onceProfitAdnLoss || 0}}
							</view>
							<view class="list-item__body-text">
								{{planInfo.remarks}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer">
							<uni-dateformat class="list-item__body-text" :date="planInfo.updateDate">
							</uni-dateformat>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-group>
		<template v-if="detailData">
			<uni-group class="group">
				<template #title>
					<view class="group__title">进行中</view>
				</template>
				<uni-grid :column="3" :square="false">
					<uni-grid-item>
						<view class="grid-item-box">
							<text class="text">买入金额</text>
							<text class="text">{{detailData.buyAmount}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box primary">
							<text class="text">仓位</text>
							<text class="text">{{detailData.position}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<button :disabled="detailData.opType === 'buy'" plain
								style="border-color: #F56C6C; color: #F56C6C;" @click="opClick(1)">买
								入</button>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<text class="text">卖出金额</text>
							<text class="text">{{detailData.sellAmount}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isProfit?'success':'danger'">
							<text class="text">{{detailData.isProfit?'盈利':'亏损'}}</text>
							<text class="text">{{detailData.profitAdnLoss}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<button :disabled="detailData.opType === 'sell' || !detailData.opType" plain
								style="border-color: #67C23A; color: #67C23A;" @click="opClick(0)">卖
								出</button>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isProfit ? 'success' : 'danger'">
							<text class="text">盈亏</text>
							<text class="text">
								{{detailData.percentage}}%
								<text class="primary">({{detailData.preAdvise}})</text>
							</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isOnceProfit ? 'success' : 'danger'">
							<text class="text">累计盈亏</text>
							<text class="text">{{detailData.oncePercentage}}%</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isTotalProfit ? 'success' : 'danger'">
							<text class="text">总盈亏</text>
							<text class="text">{{detailData.totalPercentage}}%</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-group>
			<uni-group class="group">
				<template #title>
					<view class="group__title">
						<view style="width: 100%;display: flex;justify-content: space-between;padding-right: 15px;">
							<text>操作记录</text>
							<text class="primary" style="font-size: 14px;"
								@click="navJump('/pages/assistant/records')">查看全部</text>
						</view>
					</view>
				</template>
				<view class="steps">
					<view class="steps__text-container">
						<view class="steps__text normal" v-for="item in recordLists" :key="item._id">
							<view class="steps__text--item">
								<text class="steps__text--item-text"
									:class="item.opType === 'buy' ? 'danger' : 'success'">
									{{item.opType === 'buy' ? '买入' : '卖出'}}
								</text>
								<text
									class="steps__text--item-text">金额：{{item.opType === 'buy' ? item.buyAmount : item.sellAmount}}</text>
								<text
									class="steps__text--item-text primary">{{item.opType === 'buy' ? '仓位：'+item.position : '盈亏：'+item.percentage+'%'}}</text>
							</view>
							<view class="steps__text--item" style="margin-top: 6px;font-size: 14px;">
								<text style="width: 50%;" v-if="item.opType === 'buy'" class="primary">
									亏损 {{item.targetPercent}}% 加仓
								</text>
								<text style="width: 50%;" v-else
									:class="item.isProfit ? 'success' : 'danger'">盈亏额：{{item.profitAdnLoss}}</text>
								<uni-dateformat class="info" style="width: 50%;" :date="item.updateDate" />
							</view>
						</view>
					</view>
					<view class="steps__container">
						<view class="steps__line-item" v-for="item in recordLists" :key="item._id">
							<view class="steps__line-item--before" :class="{'active':item.opType === 'sell'}"></view>
							<view class="steps__line-item--circle" v-if="item.opType === 'buy'"></view>
							<view class="steps__line-item--check" v-else>
								<uni-icons type="checkbox-filled" color="#67C23A" size="14"></uni-icons>
							</view>
							<view class="steps__line-item--after" :class="{'active':item.opType === 'sell'}"></view>
						</view>
					</view>
				</view>
			</uni-group>
		</template>
		<no-data v-if="nodata">
			<view class="grid-item-box">
				<button plain style="width: 80%;border-color: #409EFF; color: #409EFF;" @click="opClick(1)">新
					增</button>
			</view>
		</no-data>
		<uni-popup ref="popup" type="bottom" :mask-click="false">
			<view style="background-color: #ffffff;padding: 15px;border-radius: 2px 2px 0 0;">
				<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast"
					labelAlign="right" labelWidth="85">
					<uni-forms-item v-if="opType === 1" name="buyAmount" label="买入金额" required>
						<uni-easyinput placeholder="请输入" v-model="formData.buyAmount" type="digit"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 0" name="sellAmount" label="卖出金额" required>
						<uni-easyinput placeholder="请输入" v-model="formData.sellAmount" type="digit"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 1" name="position" label="仓位" required>
						<uni-number-box v-model="formData.position" min="1" max="10" />
					</uni-forms-item>
					<uni-forms-item v-if="opType === 1" name="targetPercent" label="加仓%" required>
						<uni-number-box v-model="formData.targetPercent" min="0" max="100" />
					</uni-forms-item>
					<view style="text-align: center;">
						<button class="form-button" style="width: 40%;margin-right: 10px;display: inline-block;"
							@click="cancle">取消</button>
						<button class="form-button" style="width: 40%;" type="primary" @click="submit">提交</button>
					</view>
				</uni-forms>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/planDetails.js';
	const db = uniCloud.database();
	const dbCmd = db.command;
	const plan = 'plan';
	const planDetailsDB = 'planDetails';
	const recordsDB = 'detailRecords';

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
				buyAmount: '',
				sellAmount: '',
				targetPercent: 10,
				position: 1
			}
			return {
				planId: '',
				opType: 1, // 0 卖出 1 买入
				formData,
				detailData: '',
				recordLists: [],
				planInfo: {
					planName: '',
					planType: {
						name: ''
					},
					remarks: ''
				},
				rules: {
					...getValidator(Object.keys(formData))
				},
				nodata: false
			}
		},
		onLoad(op) {
			this.planId = op.id;
		},
		onShow() {
			this.getPlan();
			this.getPlanDetails();
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			getPlan() {
				db.collection(plan).where({
					_id: this.planId
				}).get().then(res => {
					if (res.result.data.length) {
						this.planInfo = res.result.data[0];
						// console.log(this.planInfo);
					}
				})
			},
			getPlanDetails() {
				db.collection(planDetailsDB).where({
					planId: dbCmd.eq(this.planId)
				}).get().then(res => {
					if (res.result.data.length) {
						this.detailData = res.result.data[0]
						this.getRecordLists()
						this.nodata = false;
					} else {
						this.nodata = true;
					}
				})
			},
			getRecordLists() {
				db.collection(recordsDB).where({
					planId: dbCmd.eq(this.planId)
				}).orderBy('updateDate desc').limit(9).get().then(res => {
					if (res.result.data.length) {
						this.recordLists = res.result.data;
					}
				})
			},
			addRecord(params) {
				db.collection(recordsDB).add(params);
			},
			updatePlan(params) {
				db.collection(plan).where({
					_id: dbCmd.eq(this.planId)
				}).update(params);
			},
			opClick(type) {
				this.opType = type;
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
				if (this.detailData && this.detailData._id) {
					this.updateDetails()
				} else {
					this.addDetails()
				}
			},
			addDetails() {
				db.collection(planDetailsDB).add(this.getParams()).then((res) => {
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
			updateDetails() {
				db.collection(planDetailsDB).where({
					_id: this.detailData._id
				}).update(this.getParams()).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '更新成功'
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
				const lastInfo = this.detailData ? this.detailData : {
					buyAmount: 0,
					sellAmount: 0,
					position: this.formData.position,
					targetPercent: this.formData.targetPercent,
					totalBuyAmount: 0,
					totalSellAmount: 0,
					onceBuyAmount: 0,
					onceSellAmount: 0,
					isProfit: true,
					isOnceProfit: true,
					isTotalProfit: true,
					profitAdnLoss: 0,
					onceProfitAdnLoss: 0,
					totalProfitAdnLoss: 0,
					percentage: 0,
					cachePercentage: 0,
					oncePercentage: 0,
					totalPercentage: 0,
					preAdvise: 1,
					isComplete: false,
					createDate: time
				};
				const params = {
					...lastInfo,
					planId: this.planId,
					opType: this.opType === 1 ? 'buy' : 'sell',
					updateDate: time
				}
				if (this.formData.buyAmount) {
					params.buyAmount = Number(this.formData.buyAmount);
				}
				if (this.formData.sellAmount) {
					params.sellAmount = Number(this.formData.sellAmount);
				}
				if (this.opType === 1) {
					params.position = this.formData.position;
					params.targetPercent = this.formData.targetPercent;
				}
				switch (this.opType) {
					case 0: // 卖出
						this.handleSell(params, lastInfo);
						break;
					case 1: // 买入
						this.handleBuy(params, lastInfo);
						break;
				}
				if (params && params._id) {
					delete params._id
				}
				this.addRecord(params);
				this.updatePlan({
					isTotalProfit: params.isTotalProfit,
					preAdvise: params.preAdvise,
					totalPercentage: params.totalPercentage,
					opType: params.opType,
					updateDate: params.updateDate
				});
				// console.log(params);
				return params;
			},
			handleBuy(params, lastInfo) {
				if (lastInfo && lastInfo._id) {
					params.totalBuyAmount = this.$NP.plus(lastInfo.totalBuyAmount, params.buyAmount);
					if (params.isComplete) {
						params.onceBuyAmount = params.buyAmount;
					} else {
						params.onceBuyAmount = this.$NP.plus(lastInfo.onceBuyAmount, params.buyAmount);
					}

					// 如果仓位改变了，缓存收益重置
					if (params.position !== lastInfo.position) {
						params.cachePercentage = 0;
					}
					params.preAdvise = params.position;
				} else {
					params.totalBuyAmount = params.buyAmount;
					params.onceBuyAmount = params.buyAmount;
				}
			},
			handleSell(params, lastInfo) {
				// total计算
				params.totalSellAmount = this.$NP.plus(lastInfo.totalSellAmount, params.sellAmount);
				params.totalProfitAdnLoss = this.$NP.minus(params.totalSellAmount, lastInfo.totalBuyAmount);
				params.isTotalProfit = params.totalProfitAdnLoss < 0 ? false : true;
				params.totalPercentage = this.$NP.round(this.$NP.divide(params.totalProfitAdnLoss, lastInfo
					.totalBuyAmount) * 100, 2);

				// 单次计算
				params.profitAdnLoss = this.$NP.minus(params.sellAmount, lastInfo.buyAmount);
				params.isProfit = params.profitAdnLoss < 0 ? false : true;
				params.percentage = this.$NP.round(this.$NP.divide(params.profitAdnLoss, lastInfo
					.buyAmount) * 100, 2);

				// 累计计算
				if (params.isComplete) {
					params.onceSellAmount = params.sellAmount;
				} else {
					params.onceSellAmount = this.$NP.plus(lastInfo.onceSellAmount, params.sellAmount);
				}
				params.onceProfitAdnLoss = this.$NP.minus(params.onceSellAmount, lastInfo.onceBuyAmount);
				params.isOnceProfit = params.onceProfitAdnLoss < 0 ? false : true;
				params.oncePercentage = this.$NP.round(this.$NP.divide(params.onceProfitAdnLoss, lastInfo
					.onceBuyAmount) * 100, 2);
				params.isComplete = params.onceProfitAdnLoss >= 0 ? true : false;

				// 仓位预测
				params.cachePercentage = this.$NP.plus(lastInfo.cachePercentage, params.percentage);
				if (params.cachePercentage <= -lastInfo.targetPercent) {
					params.preAdvise = lastInfo.position + 1;
					params.cachePercentage = 0;
				} else if (params.cachePercentage >= 0) {
					params.cachePercentage = 0;
				}
			},
			resetForm() {
				this.formData.buyAmount = '';
				this.formData.sellAmount = '';
				this.formData.targetPercent = 10;
				this.formData.position = 1;
			},
			navJump(path) {
				uni.navigateTo({
					url: path + '?id=' + this.planId,
				})
			},
			deletePlan() {
				const _this = this;
				uni.showModal({
					title: '警告',
					content: '确定删除吗？',
					success(res) {
						if (res.confirm) {
							const p = new Promise((resolve, reject) => {
								const base = db.collection(plan);
								base.where({
									_id: _this.planId
								}).remove().then(() => {
									resolve(true);
								}).catch((err) => {
									reject(err);
								});
							});
							uni.showLoading({
								mask: true
							})
							Promise.all([_this.deleteRecords(), _this.deleteDetails(), p]).then(res => {
								uni.showToast({
									title: '删除成功'
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 300)
							}).catch(err => {
								uni.showModal({
									content: JSON.stringify(err) || '删除失败',
									showCancel: false
								})
							}).finally(() => {
								uni.hideLoading();
							})
						}
					}
				});
			},
			deleteDetails() {
				return new Promise((resolve, reject) => {
					const base = db.collection(planDetailsDB);
					base.where({
						planId: this.planId
					}).remove().then(() => {
						resolve(true);
					}).catch((err) => {
						reject(err);
					});
				});
			},
			deleteRecords() {
				return new Promise((resolve, reject) => {
					const base = db.collection(recordsDB);
					base.where({
						planId: this.planId
					}).get().then(res => {
						if (res.result.data.length) {
							res.result.data.map(async (item) => {
								return await base.where({
									_id: item._id
								}).remove();
							});
						}
						resolve(true);
					}).catch(err => {
						reject(err);
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-button {
		width: 40%;
		display: inline-block;
		line-height: 2;
	}
</style>
