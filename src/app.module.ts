import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { WsModule } from './ws/ws.module'
import { CraftsController } from './rest-modules/crafts/crafts.controller'
import { ServersController } from './rest-modules/servers/servers.controller'
import { ItemsController } from './rest-modules/items/items.controller'
import { UsersModule } from './rest-modules/users/users.module'
import { CacheModule } from '@nestjs/cache-manager'
import { PlayersController } from './rest-modules/servers/players/players.controller';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        setHeaders(res, path, stat) {
          // res.set('Access-Control-Allow-Origin', '*')
        },
      },
      serveRoot: '/api/images',
      rootPath: join(__dirname, '..', 'assets'),
    }),
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        setHeaders(res, path, stat) {
          // res.set('Access-Control-Allow-Origin', '*')
        },
      },
      renderPath: '/*',
      exclude: ['/api', '/ws'],
      rootPath: join(__dirname, '..', 'client', 'dist'),
    }),
    WsModule,
    UsersModule,
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
  ],
  controllers: [CraftsController, ServersController, ItemsController, PlayersController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
