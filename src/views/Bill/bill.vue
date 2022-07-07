<template>
  <div class="bill-main">
    <div class="header">
      <el-page-header title="返回" @back="goBack">
        <template #content>
          <span style="margin-right: 20px">{{ _data.title }}</span>
          <el-date-picker
            v-model="_data.dateStr"
            value-format="yyyy-MM"
            type="month"
            @change="changeMonth"
            placeholder="选择日期"
          >
          </el-date-picker>
        </template>
      </el-page-header>
    </div>
    <div class="summary">
      <div class="budget">
        <span class="s-title">当月预算</span>
        <span class="s-num">￥{{ _data.budget.budget }}</span>
      </div>
      <div class="cost">
        <span class="s-title">本月支出</span>
        <span class="s-num">￥{{ _data.budget.curUse }}</span>
      </div>
      <div class="per">
        <span class="s-title">支出预算比</span>
        <span class="s-num">{{ _data.budget.percentage }}%</span>
      </div>
    </div>

    <el-collapse class="accordion" v-model="_data.activeAccordionName" accordion>
      <el-collapse-item title="余额" name="1">
        <div class="item">
          <span class="name">总</span>
          <span class="value">{{ _data.accountDetail.total }}</span>
        </div>
        <div class="item">
          <span class="name">银行卡余额</span>
          <span class="value">{{ _data.accountDetail.bankBalance }}</span>
        </div>
        <div class="item">
          <span class="name">花呗</span>
          <span class="value">{{ _data.accountDetail.alipayDebt }}</span>
        </div>
        <div class="item">
          <span class="name">信用卡</span>
          <span class="value">{{ _data.accountDetail.creditDebt }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="fn-btns">
      <el-button @click="showRecordModal" icon="el-icon-plus" size="large" type="primary">记一笔</el-button>
      <el-button @click="showBudgetModal" icon="el-icon-data-line" size="large" type="primary">设置本月预算</el-button>
    </div>

    <div class="chart-content">
      <el-radio-group class="groups" v-model="_data.curChart" size="small">
        <el-radio-button label="月度支出表"></el-radio-button>
        <el-radio-button label="年度支出表"></el-radio-button>
      </el-radio-group>

      <div class="chart">
        <component :is="_data.chartComponent" :dateStr="_data.dateStr"></component>
      </div>
    </div>

    <!-- 记一笔 -->
    <dialog-mark
      :visible.sync="recordDialogVisible"
      @close="recordDialogClose"
      @success="recordDialogSuccess"
    ></dialog-mark>

    <!-- 设置预算 -->
    <dialog-budget 
    :visible.sync="budgetDialogVisible"
      @close="budgetDialogClose"
      @success="budgetDialogSuccess"
    ></dialog-budget>
  </div>
</template>

<script setup lang="ts">
import dialogMark from './components/dialogMark.vue'
import dialogBudget from './components/dialogBudget.vue'

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { budgetMonthCost } from 'src/api/bill';

interface budgetModal {
  budget: number
  curUse: number
  percentage: number
}

interface accountDetailModal {
  total: number
  bankBalance: number
  alipayDebt: number
  creditDebt: number
}
interface pageData {
  title: string
  dateStr: string
  budget: budgetModal
  accountDetail: accountDetailModal
  activeAccordionName: string
  curChart: string
  chartComponent: any
}

let _data = ref<pageData>({
  title: '月度账单',
  dateStr: '',
  budget: {
    budget: 0,
    curUse: 0,
    percentage: 0,
  },
  activeAccordionName: '1',
  accountDetail: {
    total: 0,
    bankBalance: 0,
    alipayDebt: 0,
    creditDebt: 0,
  },
  curChart: '月度支出表',
  chartComponent: null,
})

const router = useRouter()

const goBack = () => {
  router.push({ name: 'Home' })
}
const changeMonth = () => {}

onMounted(()=>{
  getBudget()
})
const store = useStore()
const getBudget = async (params:any ={})=>{
  params.uid = store.state.user.id;
  let { data, msg, code } = await budgetMonthCost(params);
  _data.value.budget = data;
}
let recordDialogVisible = ref<boolean>(false)
const showRecordModal = () => {
  recordDialogVisible.value = true
}
const recordDialogClose = () => {
  recordDialogVisible.value = false
}
const recordDialogSuccess = () => {
  recordDialogClose()
}

let budgetDialogVisible = ref<boolean>(false)
const showBudgetModal = () => {
  budgetDialogVisible.value = true
}
const budgetDialogClose = () => {
  budgetDialogVisible.value = false
}
const budgetDialogSuccess = () => {
  recordDialogClose()
}

const cancelBudget = () => {}
</script>

<style lang="scss" scoped>
@import './bill.scss';
</style>
