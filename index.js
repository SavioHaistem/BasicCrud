
//Exportando as partes necessárias para criar o servidor
const express = require('express'); //O express é usado para criar o servidor
const server = express() // usamos o express() que irá iniciar o servidor
const router = express.Router() // criamos o gerenciador de rotas com o express router
const fs = require('fs'); // O fs signfica File System e é o gerenciador de arquivos padrão

server.use(express.json({extended: true})); //Configuramos o express para usar Json

// Criamos uma função aqui que ler o arquivo utilizando o file system
const readFile =()=> {
  const EncodedCountent = fs.readFileSync('./data/estoque.json', 'utf-8')
  return JSON.parse(EncodedCountent)
}

// E também a função que utiliza file system para escrever no arquivo
const writeFile =(data)=> {
  fs.writeFileSync('./data/estoque.json', JSON.stringify(data), 'utf-8')
}

// Então utilizamos o router para criar as rotas do CRUD
// rota get busca items no banco
router.get('/', (req, res) => {
  const currentContent = readFile()
  req.body.key ? res.send(currentContent.filter(item => item.name == req.body.key)) : res.send(currentContent)
})

// rota post adiciona items ao banco de dados
router.post('/', (req, res) => {
  const { name, value } = req.body
  const id = Math.random().toString(32).substring(2, 9)
  const currentContent = readFile()
  currentContent.push({ id, name, value })
  writeFile(currentContent)

  res.send({ id, name, value })
})

// rota put edita os items do banco de dados
router.put('/:id', (req, res) => {

  const {id} = req.params;
  const currentContent = readFile();
  const { name, value } = req.body;

  let selectedItemIndex = currentContent.findIndex(item => item.id === id )
  const { name: currentName, value: currentValue } = currentContent[selectedItemIndex]

  const newContent = {
    id: id,
    name: name ? name : currentName,
    value: value ? value : currentValue
  }

  currentContent[selectedItemIndex] = newContent;

  writeFile(currentContent)
  res.send(currentContent)
  
})

// rota delete apaga os items do banco de dados
router.delete('/', (req, res) => {
  const newContent = []
  const currentContent = readFile();
  currentContent.forEach(item => { if( item.name != req.body.remove) { newContent.push(item)} })
  writeFile(newContent)

  res.send(newContent)
})

// Após configurarmos as rotas configuramos o servidor para usar as rotas
server.use(router);

// Iniciamos o servidor utilizando a porta
server.listen(5555, ()=> {
  console.log('rodando servidor na porta 5555')
})