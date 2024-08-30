import { projects, clients } from "../sampleData";
import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import Project from "../models/Project";
import Client from "../models/Client";

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    })
})

const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        clientId: {type: GraphQLString},
        client: {
            type: ClientType,
            async resolve(parent:any){
                // return await clients.findById(parent.clientId)
                return await Client.findById(parent.clientId)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        project: {
            type: ProjectType,
            args: {id: {type: GraphQLID}},
            resolve: async (_:any, args:any)=>{
                return await Project.findById(args.id);
            }
        },
        projects: { 
            type: new GraphQLList(ProjectType),
            resolve: async (_:any, __:any)=>{
                return await Project.find()
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve: async (_:any, __:any)=>{
                return await Client.find();
            }
        },
        client: {
            type: ClientType,
            args: {id: {type: GraphQLID}},
            resolve: async (_:any, args)=>{
                return await Client.findById(args.id)
            }
        }
    }
})


export default new GraphQLSchema({
    query: RootQuery
})