<template>
  <el-dialog width="600px" @close="cancelBudget" title="预算管理" v-model="props.visible" :closeOnClickModal="false">
    <el-form :model="budgetForm" :rules="rules" ref="budgetFormRef">
      <el-form-item label="月份" prop="dateMonth" label-width="100px">
        <el-date-picker v-model="budgetForm.dateMonth" value-format="yyyy-MM" type="month" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="金额" prop="budget" label-width="100px">
        <el-input class="r-input" v-model.number="budgetForm.budget" placeholder="请填写金额">
          <template slot="prepend">￥</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelBudget">取 消</el-button>
      <el-button type="primary" @click="saveBudget(budgetFormRef)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElNotification, FormInstance, FormRules } from 'element-plus'
import { addBudget } from 'src/api/bill'
import { ref } from 'vue'

let props = defineProps({
  visible: Boolean,
})
const rules: FormRules = {}

interface budgetFormModal {
  dateMonth: string
  budget: number | string
}

let budgetForm = ref<budgetFormModal>({
  dateMonth: '',
  budget: '',
})

const budgetFormRef: any = ref<FormInstance>()
const emit = defineEmits(['close', 'success'])
const cancelBudget = (): void => {
  budgetForm.value = {
    dateMonth: '',
    budget: '',
  }
  emit('close')
}
const saveBudget = (formRef: FormInstance): void => {
  formRef.validate(async (flag: boolean) => {
    if (!flag) return
    let params = { ...budgetForm }
    let { data, status } = await addBudget(params)
    if (status == 200) {
      ElNotification.success({
        title: '消息',
        message: '添加成功',
      })
      emit('success')
      cancelBudget()
    }
  })
}
</script>

<style lang="scss" scoped></style>
