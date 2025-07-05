# 由于Workers基于JavaScript，需将Python后端改写为JavaScript
// app.js - Cloudflare Workers入口文件
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 百炼API调用函数
async function callDashScopeAPI(prompt) {
  const API_KEY = 'API_KEY'; // 建议从Workers环境变量获取
  const APP_ID = '3cf439eac83f4b069061a7b20e05370d';
  
  try {
    const response = await fetch('https://api.dashscope.com/v1/applications/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        app_id: APP_ID,
        prompt: prompt
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API错误: ${error.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.output.text;
  } catch (error) {
    console.error('调用百炼API失败:', error);
    throw error;
  }
}

// 处理HTTP请求
async function handleRequest(request) {
  if (request.method === 'POST' && request.url.endsWith('/api/call-ai')) {
    try {
      const body = await request.json();
      const prompt = body.prompt || '';
      
      if (!prompt) {
        return new Response(JSON.stringify({ error: '缺少prompt参数' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const responseText = await callDashScopeAPI(prompt);
      return new Response(JSON.stringify({ response: responseText }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('请求处理失败:', error);
      return new Response(JSON.stringify({ 
        error: '内部服务器错误', 
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 测试API
  if (request.method === 'GET' && request.url.endsWith('/test-api')) {
    return new Response(JSON.stringify({ message: 'Test API is working!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 其他请求返回404
  return new Response('Not Found', { status: 404 });
}