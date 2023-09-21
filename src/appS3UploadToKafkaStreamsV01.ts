
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { pipeline, Readable } from 'stream'
import  { promisify }  from 'util';
import csv from 'csv-parser';
import { Kafka} from 'kafkajs'

// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);

let count = 0
let fileLength = 0
const kafka = new Kafka({
   brokers: ['127.0.0.1:9091']
 })
const producer = kafka.producer();

async function initKafka(){
  console.log('connection kafka')
  //await producer.connect()
  console.log('kafka conected')
}

async function stopKafka(){
  console.log('connection kafka')
  //await producer.disconnect()
  console.log('kafka conected')
}


const clientS3 = new S3Client({
    credentials: {
      accessKeyId: 'AKIATWM4LBGWIM3FHCVF',
      secretAccessKey: '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'
    },
    region: 'sa-east-1'
  });

async function* download() {
      const { Body } = await clientS3.send(new GetObjectCommand({ Bucket: 'crm-d365-s3-campaign-82da64', Key: '1234456_CAMPANHA QUALQUER COISA_dadf9112-af9b-4fab-95a2-1a8725e80e50' }))
      const stream = Body as Readable;
      for await (const line of stream) {
        yield line
      } 
};

async function* transform(streams: any){
    for await (const chunk of streams) {   
      console.log(chunk.toString().length)
       if(chunk.CPF, chunk.detalhes){
         const campanha = {
             id_campanha: 'www',
             nome: 'teste',
             cpf: chunk.CPF.replace(/["]/g, '').trim(),
             detalhes: chunk.detalhes,
             data_de_inclusao: new Date().toISOString(),
             id: '',
             resultado: '',
             status_campanha_elegivel: 1
           };
           count++
         //console.log('>>>>>>>', JSON.stringify(campanha), count)
          // const data = await producer.send({
          //   topic: 's3tokafka',
          //   messages: [ { value: JSON.stringify(campanha)}]
          //  })
           //console.log('>>>>>>>', JSON.stringify(campanha), count, data)
       }       
    }  
    yield 
}

const run = async() =>{
    initKafka()    
    await pipelineAsync(
        download,
        csv({
            separator: ';',
            skipLines: 4
          }),
        transform,
    )
    await stopKafka()    
    console.log('Total registers ', count)
  }

run();