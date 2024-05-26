import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongooseError } from 'mongoose';

import { AppService } from 'src/common';
import { deleteAllFiles, getPath } from 'src/utils';

@Catch(MongoError, MongooseError)
export class MongooseExceptionFilter
  extends AppService
  implements ExceptionFilter
{
  constructor() {
    super();
  }

  catch(exception: MongoError | MongooseError, host: ArgumentsHost) {
    const responseMessage = this.response(host);
    deleteAllFiles(getPath('src', 'temp'));

    if (exception instanceof MongoError) {
      switch (exception.code) {
        case 11000:
          responseMessage(exception.name, exception.message, 400);
      }
    } else {
      switch (exception.name) {
        case 'ValidationError':
          responseMessage(exception.name, exception.message, 400);
      }
    }
  }
}
