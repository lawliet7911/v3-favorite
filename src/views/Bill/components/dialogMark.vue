<template>
  <el-dialog width="600px" @close="cancelRecord" title="记一笔" v-model="props.visible" :closeOnClickModal="false">
    <el-form :model="recordForm" :rules="rules" ref="recordFormRef">
      <el-form-item label="日期" prop="costDate" label-width="100px">
        <el-date-picker v-model="recordForm.costDate" value-format="YYYY-MM-DD" type="date" placeholder="选择日期">
        </el-date-picker>
        <el-button class="span-l" @click="setDate(0)">今天</el-button>
        <el-button @click="setDate(-1)">昨天</el-button>
        <el-button @click="setDate(-2)">前天</el-button>
      </el-form-item>
      <el-form-item label="金额" prop="amount" label-width="100px">
        <el-input class="r-input" v-model="recordForm.amount" placeholder="请填写金额">
          <template slot="prepend">￥</template>
        </el-input>
      </el-form-item>

      <el-form-item label="类型" prop="recordType" label-width="100px">
        <el-radio v-model="recordForm.recordType" :label="1">收入</el-radio>
        <el-radio v-model="recordForm.recordType" :label="0">支出</el-radio>
      </el-form-item>

      <el-form-item label="类别" prop="type" label-width="100px">
        <el-input class="r-input" v-model="recordForm.type" placeholder="请填写类别"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelRecord">取 消</el-button>
      <el-button type="primary" @click="saveRecord(recordFormRef)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dateFormat } from 'src/utils/date'
import { addRecord } from 'src/api/bill'
import { ElNotification, FormInstance, FormRules } from 'element-plus'
interface recordFormModal {
  costDate: string
  amount?: number | string
  recordType: number
  type: string
}
let recordForm = ref<recordFormModal>({
  costDate: '',
  recordType: 0,
  type: '',
  amount: '',
})

let props = defineProps({
  visible: Boolean,
})

let recordDialogVisible = <boolean>false

const rules: FormRules = {
  costDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  type: [{ required: true, message: '请输入类别', trigger: 'blur' }],
}

const emit = defineEmits(['close', 'success'])

watch(
  () => props.visible,
  (n, o) => {
    if (n) recordForm.value.costDate = dateFormat(new Date(), 'yyyy-MM-dd')
  }
)

const cancelRecord = () => {
  recordForm.value.costDate = ''
  recordForm.value.recordType = 0
  recordForm.value.type = ''
  recordForm.value.amount = ''
  emit('close')
}
const setDate = (type: number) => {
  let date: Date | undefined
  let curDate = new Date()
  if (type === 0) {
    date = curDate
  } else if (type === -1) {
    date = new Date(curDate.setDate(curDate.getDate() - 1))
  } else {
    date = new Date(curDate.setDate(curDate.getDate() - 2))
  }
  recordForm.value.costDate = dateFormat(date, 'yyyy-MM-dd')
}

const recordFormRef: any = ref<FormInstance>()
const saveRecord = (formRef: FormInstance) => {
  formRef.validate(async (flag: boolean) => {
    if (!flag) return
    let params = { ...recordForm.value }
    let res:any = await addRecord(params)
    let { data, code, msg } = res
    if (code == 200) {
      ElNotification.success({
        title: '消息',
        message: '添加成功',
      })
      emit('success')
      cancelRecord()
    }
  })
}
</script>
