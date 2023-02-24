<template>
  <el-dialog
    width="600px"
    @close="cancelBudget"
    title="预算管理"
    :model-value="props.visible"
    :closeOnClickModal="false"
  >
    <el-form :model="budgetForm" :rules="rules" ref="budgetFormRef">
      <el-form-item label="月份" prop="dateMonth" label-width="100px">
        <el-date-picker
          v-model="budgetForm.dateMonth"
          value-format="YYYY-MM"
          type="month"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="金额" prop="budget" label-width="100px">
        <el-input class="r-input" v-model.number="budgetForm.budget" placeholder="请填写金额">
          <template v-slot:prepend>￥</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelBudget">取 消</el-button>
        <el-button type="primary" @click="saveBudget(budgetFormRef)">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import 
{ ElNotification, FormInstance, FormRules } from 'element-plus'
import { addBudget } from 'src/api/bill'
import { ref, watch } from 'vue'

let props = defineProps({
  visible: Boolean,
  data: Object
})

watch(
  () => props.visible,
  (n, o) => {
    if (n) {
      budgetForm.value.dateMonth = 


      
      (props as any).data.dateStr
      budgetForm.value.budget = 
      (props as any).data.budget.budget
    }
  }
)

const rules: FormRules = {}

interface budgetFormModal {
  dateMonth: string
  budget: number | string
}

     



















let budgetForm = ref<budgetFormModal>({
  dateMonth: '',
  budget: ''
})

const budgetFormRef: any = ref<FormInstance>()
const emit = defineEmits(['close', 'success'])
const cancelBudget = (): void => {
  budgetForm.value = {
    dateMonth: '',
    budget: ''
  }
  emit('close')
}
const saveBudget = (formRef: FormInstance): void => {
  formRef.validate(async (flag: boolean) => {
    if (!flag) return
    let params = { ...budgetForm.value }
    let res: any = await addBudget(params)
    let { data, code } = res
    if (code == 200) {
      ElNotification.success({
        title: '消息',
        message: '保存成功'
      })
      emit('success')
      cancelBudget()
    }
  })
}
</script>

<style lang="scss" scoped></style>
