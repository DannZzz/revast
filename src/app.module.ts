import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { WsModule } from './ws/ws.module'
import { CraftsController } from './rest-modules/crafts/crafts.controller'
import { ServersController } from './rest-modules/servers/servers.controller'
import { ItemsController } from './rest-modules/items/items.controller'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        setHeaders(res, path, stat) {
          res.set('Access-Control-Allow-Origin', '*')
        },
      },
      serveRoot: '/assets',
      rootPath: join(__dirname, '..', 'assets'),
    }),
    WsModule,
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
  ],
  controllers: [CraftsController, ServersController, ItemsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
