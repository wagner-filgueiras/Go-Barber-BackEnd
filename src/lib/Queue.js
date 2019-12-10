import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

/*
Para cada job criamos uma fila e adicionamos o bee
que é nossa instância que conecta com redis que consegue armazenar e
recuperar valores do banco de dados.
E o nosso handle que processa a fila
O process queue vai pegar esses jobs e vai ficar processando em tempo real
*/

class Queue {
  constructor() {
    // uma fila para cada background job em nossa aplicação
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Toda vez que chamarmos o método Add passando cancellationMail como primeiro parametro (queue)
  // e os dados do appointment como segundo parametro (job) ele vai colocar na fila em background
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: Failed`, err);
  }
}

export default new Queue();
