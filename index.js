const express = require('express');
const server = express()
const router = express.Router()
const fs = require('fs');

server.use(express.json({extended: true}));

const readFile =()=> {
  const EncodedCountent = fs.readFileSync('./data/estoque.json', 'utf-8')
  return JSON.parse(EncodedCountent)
}
const writeFile =(data)=> {
  fs.writeFileSync('./data/estoque.json', JSON.stringify(data), 'utf-8')
}

router.get('/', (req, res) => {
  const currentContent = readFile()
  req.body.key ? res.send(currentContent.filter(item => item.name == req.body.key)) : res.send(currentContent)
})

router.post('/', (req, res) => {
  const { name, value } = req.body
  const id = Math.random().toString(32).substring(2, 9)
  const currentContent = readFile()
  currentContent.push({ id, name, value })
  writeFile(currentContent)

  res.send({ id, name, value })
})

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

router.delete('/', (req, res) => {
  const newContent = []
  const currentContent = readFile();
  currentContent.forEach(item => { if( item.name != req.body.remove) { newContent.push(item)} })
  writeFile(newContent)

  res.send(newContent)
})

server.use(router);
server.listen(5555, ()=> {
  console.log('rodando servidor na porta 5555')
})