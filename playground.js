/* Small local configurator: no network requests, generated claims, or form submission. */
(() => {
  const root=document.querySelector('#playground');
  if(!root)return;
  const get=id=>root.querySelector(`#pg-${id}`);
  const audiences={
    expert:{name:'эксперта',label:'ЭКСПЕРТ',title:'Консультации по записи.',description:'Темы встреч, формат работы и свободное время.',items:['Консультации','Формат встреч','Записаться ↗'],chat:['Что запланируем?','Консультацию на 30 минут.'],site:'описание консультаций, формат встреч и запись',bot:'выбор консультации, свободного времени и подтверждение записи'},
    shop:{name:'магазина',label:'МАГАЗИН',title:'Товары без лишних поисков.',description:'Каталог, информация о доставке и оформление заявки.',items:['Каталог товаров','Условия доставки','Оставить заявку ↗'],chat:['Что ищешь в каталоге?','Покажи доступные товары.'],site:'каталог товаров, условия доставки и форма заявки',bot:'каталог товаров, выбор товара и заявка на заказ'},
    team:{name:'команды',label:'КОМАНДА',title:'Все задачи в одном месте.',description:'Задачи, ответственные и ближайшие сроки.',items:['Список задач','Кто отвечает','Добавить задачу ↗'],chat:['Добавим задачу?','Подготовить макет к пятнице.'],site:'список задач, ответственные и сроки',bot:'добавление задач, выбор ответственного и напоминания'}
  };
  let kind='site',audience='expert';
  function render(){
    const data=audiences[audience],isBot=kind==='bot';
    root.dataset.kind=kind;
    get('badge').textContent=`${isBot?'TELEGRAM-БОТ':'САЙТ'} / ${data.label}`;
    get('title').textContent=isBot?`Бот для ${data.name}.`:data.title;
    get('description').textContent=isBot?`Пример: ${data.bot}.`:data.description;
    ['one','two','three'].forEach((id,i)=>get(id).textContent=data.items[i]);
    get('site').hidden=isBot;get('bot').hidden=!isBot;
    get('chat-request').textContent=data.chat[0];get('chat-response').textContent=data.chat[1];
    get('brief').value=`Нужен ${isBot?'Telegram-бот':'сайт'} для ${data.name}. ${isBot?'В боте':'На странице'}: ${isBot?data.bot:data.site}.`;
    get('status').textContent=`Макет: ${isBot?'Telegram-бот':'сайт'} для ${data.name}. Описание можно скопировать.`;
  }
  root.querySelector('form').addEventListener('change',event=>{
    const {name,value}=event.target;
    if(name==='pg-kind'&&['site','bot'].includes(value))kind=value;
    else if(name==='pg-audience'&&Object.hasOwn(audiences,value))audience=value;
    else return;
    render();
  });
  get('copy').disabled=false;
  get('copy').addEventListener('click',async()=>{
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(get('brief').value);
      get('status').textContent='Скопировано. Можно вставить в сообщение Денису.';
    }catch{get('status').textContent='Не удалось скопировать: выдели описание выше и скопируй вручную.';}
  });
  render();
})();
