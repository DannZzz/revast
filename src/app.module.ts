import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { WsModule } from './ws/ws.module'
import { CraftsController } from './rest-modules/crafts/crafts.controller'
import { ServersController } from './rest-modules/servers/servers.controller'
import { ItemsController } from './rest-modules/items/items.controller'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        setHeaders(res, path, stat) {
          res.set('Access-Control-Allow-Origin', '*')
        },
      },
      serveRoot: '/api/images',
      rootPath: join(__dirname, '..', 'assets'),
    }),
    ServeStaticModule.forRoot({
      serveStaticOptions: {},
      renderPath: '/*',
      exclude: ['/api', '/ws'],
      rootPath: join(__dirname, '..', 'client', 'dist'),
    }),
    WsModule,
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
  ],
  controllers: [CraftsController, ServersController, ItemsController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
