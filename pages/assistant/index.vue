<template>
	<view>
		<uni-group class="group" v-for="list in planLists" :key="list.id">
			<template #title>
				<view class="group__title">{{list.name}}</view>
			</template>
			<uni-list>
				<uni-list-item class="list-item" v-for="subList in list.children" :key="subList._id" link
					:to="'/pages/assistant/detail?id='+subList._id">
					<template #body>
						<view class="list-item__body">
							<view class="list-item__body-title">
								<text>{{subList.planName}}</text>
							</view>
							<view class="list-item__body-text">
								{{subList.remarks}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer primary">
							<text
								:class="subList.isTotalProfit? 'success' : 'danger'">{{subList.totalPercentage}}%</text>
							<text v-if="subList.opType === 'sell'" style="margin-left: 18px;">
								建议仓位: {{subList.preAdvise}}</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-group>
		<uni-fab :horizontal="'right'" :popMenu="false" @fabClick="fabClick"></uni-fab>
	</view>
</template>

<script>
	import DateFormat from '../../js_sdk/xfl-DateFormat/DateFormat.js'
	const db = uniCloud.database();
	const dbCmd = db.command
	const planDB = 'plan';
	export default {
		data() {
			return {
				userId: '',
				planLists: []
			}
		},
		onLoad() {
			this.userId = getApp().globalData.userId
		},
		onShow() {
			this.getPlanLists()
		},
		methods: {
			getPlanLists() {
				db.collection(planDB).where({
					userId: dbCmd.eq(this.userId)
				}).orderBy('updateDate desc').get().then(res => {
					if (res.result.data.length) {
						this.planLists = [];
						const typeTolist = new Map();
						res.result.data.forEach(item => {
							item.updateDate = new DateFormat(item.updateDate).toString(
								'yyyy-mm-dd hh:ff:ss')
							const hasExt = typeTolist.get(item.planType.field)
							if (hasExt) {
								hasExt.children.push(item)
							} else {
								const newList = {
									id: item.planType._id,
									name: item.planType.name,
									field: item.planType.field,
									children: [item]
								}
								typeTolist.set(item.planType.field, newList)
							}
						})
						typeTolist.forEach(item => {
							this.planLists.push(item)
						})
					}
				})
			},
			fabClick() {
				uni.navigateTo({
					url: '/pages/assistant/add'
				})
			}
		},
	}
</script>

<style lang="scss" scoped></style>
