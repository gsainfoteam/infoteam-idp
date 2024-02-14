import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async findClientsByUserUuid(
    userUuid: string,
  ): Promise<Omit<Client, 'password' | 'id'>[]> {
    this.logger.log(`findClientsByUserUuid: userUuid=${userUuid}`);
    return this.prismaService.client.findMany({
      where: {
        member: {
          some: {
            uuid: userUuid,
          },
        },
      },
      select: {
        uuid: true,
        name: true,
        urls: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findClientByUuidAndUserUuid(
    uuid: string,
    userUuid: string,
  ): Promise<Omit<Client, 'password' | 'id'>> {
    this.logger.log(`findClientByUuid: uuid=${uuid}`);
    return this.prismaService.client
      .findUniqueOrThrow({
        where: {
          uuid,
          member: {
            some: {
              uuid: userUuid,
            },
          },
        },
        select: {
          uuid: true,
          name: true,
          urls: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          this.logger.debug(`findClientByUuid: error=${error}`);
          throw new ForbiddenException();
        }
        this.logger.error(`findClientByUuid: error=${error}`);
        throw new InternalServerErrorException();
      });
  }
}
