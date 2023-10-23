"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdz_agent_types_1 = require("sdz-agent-types");
class MongoDBRepository extends sdz_agent_types_1.AbstractRepository {
    execute(query, page, limit) {
        return this.getConnector().execute(query
            .replace(/:skip/g, String(page * limit))
            .replace(/:limit/, String(limit)));
    }
}
exports.default = MongoDBRepository;
