import { MongoClient } from "mongodb";
import { ConnectorInterface, DatabaseRow } from "sdz-agent-types";

export default class Connector implements ConnectorInterface {
  private connection: MongoClient;
  private config: any;

  constructor(config: any) {
    this.setConfig(config);
  }

  async connect(): Promise<void> {
    if (!this.connection) {
      try {
        const uri = this.config.port
          ? `mongodb://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/?maxPoolSize=1&w=majority`
          : `mongodb+srv://${this.config.username}:${this.config.password}@${this.config.host}/?maxPoolSize=1&w=majority`;
        const client = new MongoClient(uri);
        await client.connect();
        this.connection = client;
      } catch (e) {
        console.log(e);
      }
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async execute(query: string): Promise<DatabaseRow[]> {
    let resultSet: DatabaseRow[] = [];
    if (!this.connection) {
      await this.connect();
    }
    try {
      const input = JSON.parse(query);
      const database = this.connection.db(this.config.schema);
      const collection = database.collection(input["collection"]);
      const command = collection[input["command"]].bind(collection);
      resultSet = await command<any[]>(input[input["command"]]).toArray();
      return resultSet;
    } catch (e) {
      console.log(e);
    }
    return resultSet;
  }

  private setConfig(config: any): this {
    this.config = config;
    return this;
  }
}
