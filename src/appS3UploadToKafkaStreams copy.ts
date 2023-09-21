import { db } from "./db";
const Cursor = require('pg-cursor');
import { appendFile } from 'fs/promises';
import { json2csv } from 'json-2-csv';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import QueryStream   from 'pg-query-stream';
import { pipeline, Writable, Readable } from 'stream'
const { promisify } = require('util');
var fs = require('fs');
import csv from 'csv-parser';



// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);

const writable = new Writable({
    write(chunk, encoding, cb) {
        console.log('fim', chunk);
        cb();
    }
})


const modifyData = (data: any[]) => {
    return data.map((dataItem) => {
        return {
            origin_id: dataItem.dataItem,
            name: dataItem.message.replace(/(\r\n|\n|\r)/gm, ""),
            destination: dataItem.destination,
            Data_envio: dataItem.data_envio,
            Data_atualizacao_status: dataItem.data_atualizacao_status,
            status: dataItem.status,
            SID_identificacao_mensagem: dataItem.sid_identificacao_mensagem,
            Qtde_segmentos: dataItem.qtde_segmentos,
            Processo_negocio: dataItem.processo_negocio
        };
    });   
}



const main = async() => {
    const clientS3 = new S3Client({
        credentials: {
          accessKeyId: 'AKIATWM4LBGWIM3FHCVF',
          secretAccessKey: '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'
        },
        region: 'sa-east-1'
      });
    
      const { Body } = await clientS3.send(new GetObjectCommand({ Bucket: 'crm-d365-s3-campaign-82da64', Key: '1234456_CAMPANHA QUALQUER COISA_dadf9112-af9b-4fab-95a2-1a8725e80e50' }))

      const stream = Body as Readable;

      for await (const line of stream) {
        console.log(line.toString())
      } 

      stream
      .pipe(
        csv({
          separator: ';',
          skipLines: 4
        })
      )
      .on('data', (msg) => {
        const campanha = {
          id_campanha: 'www',
          nome: 'teste',
          cpf: msg.CPF.replace(/["]/g, '').trim(),
        };
        console.log('nova >>>>>>>', campanha);
      });

console.log('>>>>>>>>>>>> fim')
};

main();