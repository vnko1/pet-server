import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';

import { AppService } from 'src/common';
import { deleteAllFiles, getPath } from 'src/utils';

@Catch()
export class AppHttpExceptionFilter
  extends AppService
  implements ExceptionFilter
{
  constructor() {
    super();
  }
  async catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const responseMessage = this.response(host);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    deleteAllFiles(getPath('src', 'temp'));

    if (exception.message) {
      responseMessage('Error', exception.message, status);
    } else {
      responseMessage(exception.name, exception.message, status);
    }
  }
}
