/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */

module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },

  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/
  // someMysqlServer: {
  //   adapter: 'sails-mysql',
  //   host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_MYSQL_USER', //optional
  //   password: 'YOUR_MYSQL_PASSWORD', //optional
  //   database: 'YOUR_MYSQL_DB' //optional
  // },

  /***************************************************************************
  *                                                                          *
  * MongoDB is the leading NoSQL database.                                   *
  * http://en.wikipedia.org/wiki/MongoDB                                     *
  *                                                                          *
  * Run: npm install sails-mongo                                             *
  *                                                                          *
  ***************************************************************************/
  // someMongodbServer: {
  //   adapter: 'sails-mongo',
  //   host: 'localhost',
  //   port: 27017,
  //   user: 'username', //optional
  //   password: 'password', //optional
  //   database: 'your_mongo_db_name_here' //optional
  // },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
  // somePostgresqlServer: {
  //   adapter: 'sails-postgresql',
  //   host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_POSTGRES_USER', // optional
  //   password: 'YOUR_POSTGRES_PASSWORD', // optional
  //   database: 'YOUR_POSTGRES_DB' //optional
  // }


  /***************************************************************************
  *                                                                          *
  * More adapters: https://github.com/balderdashy/sails                      *
  *                                                                          *
  ***************************************************************************/
  firebase: {
    adapter: 'sails-firebase',

    credential: {
      "type": "service_account",
      "project_id": "godly-web",
      "private_key_id": "9924f18108b1382bb0494330028ef7b3d70ae674",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn3FXBPk4LwQtp\nFPBt794WB8if/MbFVI1zXMlCAy2JE7KClTvz9yb87p9P8u+meGQscl7WwckdNcl4\n92e6nCsDehOeKy0OX1bfgcD1frdJKkjgnRXdPQsAjHVwJ03cwa7fF71i16nSSzHV\nbCRLLuOrNx/lmt7sFaLjFKjJRl8OUOUZq8Ctdo+e4T7M7ItvG1HywoqjxQV5CVK2\nMjbjHqNFjTczorxxA2MMJuEhTJJPFnoLeLXQscBPkgeS58JeOvKuDCbKqkmGyqKl\nPaxoO4KLhTn5VqEK3vdfVJ8I44ADZclS7f5au1TfrWXFInvTCUrKR4Jc9ArKsfRq\n3JV3ol3pAgMBAAECggEACTrMvkziNrQ9H+CGXc0gHX79EYrxFP2Sr4KtEEOjd9OM\n77Ar9TykOKkYOmmlsrYQ7/6z50QNfl0sQEn+Op0GonDOblZ6aj1kxfJY/Uaj5lJ8\nYllQz/LgzX1roaiPl/FQX7Tq9WndTRJUYaNKFZY073+e8d2Dn2CLLcg/hZ2ocV17\nXmhrQ6pk/5PxlLh9CxCAC0etV1Oa0dI3dzSuhC69JKmUkVkltqGwBWljEzeOFOB4\n0QFZHd3q4FindKPbeUQ5wXfgKyEtgIIayuHURFkSO5Tgk7apqWdRmp6uD3x2f0ZN\n6S2dgefC1T48Pl5Z2MLhaBcOmh0fOnl04S1MDnR1+QKBgQDpYtTMLupT/BcGO0wF\n2pMpuOhuccMsirxou2uDh3E3/M+J0cnnLl9jXI52C6hSS02GC1jUWRzpVH9Iy3pg\nPJlUZQmdZ9aL9UeH1Z7UneziH9AOAlBYawj3pbgzkrDCR3cDVnMoA8xMtmypNG5C\nAL3Y6EcTZ72+QPJdEKaXUNr5HQKBgQC4ICOY4S2qEp09dYZlJU/9ncrc7qCv37Lf\n3JKlg7ocyinkuqJf/FDnfTKUmemjDV8xfS6vMIl0rOOojrantVBGCYZGQD2Vc7PR\ndgcfPvg72ZEABNxXnAlcneuDJHZyBZ4Oc0u5I8zFzr2O8um0ieMASec8Qdm+DnEZ\nok5X91tqPQKBgQDlsInDpgyiuUAjtuob/MDG2B+Qys+OH8BLxuCKIxtvQZUzi0+N\nAVuJm4btcI2o6EmUucgjvMwyayGWEAQRgLJal9G9o3tIZQ6QBdJ6aC7BYRPPJcHT\nMwwxRlyiDSV/HvxnQYa2A/7mJMeOQ3ab6MTvG7MPyxK3ko20v/VkiIPplQKBgAZ7\n+0TzCSyoIyl67hS5z6ta1z4YmUgYVLBVkESL8w34gKkxeW5v8Fl2q0VYdkXrvqJ7\nih1ZVD3rqMjS3dPiKsWMqFHpCUIuJPMHeRC8ovlYnCaoBSqAsEO2vAiOTC2PzRUt\nMkl+3UNKGJrkKx7UjE4CTEZu+0AaOhlxAdlPOMTxAoGAID42iCHZFaJtbjMiSEA5\nSGbPfwk3eOUDRl5C4WGSbLZqW9pJzbUudMYax1JwIgZbR+1xU50RGICyAFfgLYLd\n+364lr7PVJTaStTmjYkbXmmkNZKXqNKyjwM9R7s+kFlFqwZlu4kmyxNZwXF/nX0b\nepW3j6MpMoiwy0LbfqT760w=\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-r9sed@godly-web.iam.gserviceaccount.com",
      "client_id": "114107799441342369567",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r9sed%40godly-web.iam.gserviceaccount.com"
    },

    databaseURL: "https://godly-web.firebaseio.com",
  },

};
