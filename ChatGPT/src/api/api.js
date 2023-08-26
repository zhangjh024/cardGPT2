import axios from 'axios'
import { SSE } from 'sse'
import { env } from '../env'

const DEFAULT_TIMEOUT = 60 * 1000
const chatRequest = (data) => {
  const req = {
    model: 'gpt-3.5-turbo',
    messages: data.messages || [],
    temperature: data.temperature || 1,
    top_p: data.top_p || 1,
    n: data.n || 1,
    stream: data.stream || false,
    presence_penalty: data.presence_penalty || 0,
    frequency_penalty: data.frequency_penalty || 0
  }
  return JSON.stringify(req)
}

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  proxy: env.proxy || {}
}

const ChatGPTApi = axios.create(axiosConfig)
const ChatGPTSSEApi = (data, conf) => {
  const headers =
    'headers' in conf
      ? {
          'Content-Type': 'application/json',
          Authorization: conf.headers.Authorization
        }
      : { 'Content-Type': 'application/json' }

  const payload = conf.transformRequest.reduce((acc, transform) => transform(acc), data)
  // 该表达式的目的是将输入的 data 对象转换为适合 ChatGPT API 的请求格式。
  // payload 变量将存储 chatRequest 函数返回的 JSON 字符串，该字符串将在后续步骤中用作请求的有效负载。
  return new SSE(conf.baseURL, {
    headers,
    payload,
    method: 'POST'
  })
}

export const post_GetMessage = (
  data,
  api_key = '',
  api_url = env.apiURL,
  cancelToken = null,
  timeout = DEFAULT_TIMEOUT
) => {
  const commonConf = {
    baseURL: api_url,
    transformRequest: [chatRequest],
    timeout: timeout
  }
  const conf = api_key
    ? {
        ...commonConf,
        headers: { Authorization: 'Bearer ' + api_key }
      }
    : commonConf

  if (data.stream) {
    return ChatGPTSSEApi(data, conf)
  } else {
    return ChatGPTApi.post('', data, { ...conf, cancelToken })
  }
}

const CreditGrantsApi = axios.create(axiosConfig)
export const get_GetCreditGrants = (api_url, api_key) => {
  let url = api_url
  if (api_url.indexOf('api.openai.com') >= 0) {
    url = 'https://api.openai.com/dashboard/billing/credit_grants'
  }
  return CreditGrantsApi.get(url, {
    headers: {
      Authorization: 'Bearer ' + api_key
    }
  })
}

const PromptApi = axios.create(axiosConfig)
export const get_GetPrompts = (cancelToken) => {
  return PromptApi.get(
    'https://raw.githubusercontent.com/PlexPt/awesome-chatgpt-prompts-zh/main/prompts-zh.json',
    {
      cancelToken: cancelToken,
      timeout: DEFAULT_TIMEOUT
    }
  )
}
