import { projects, clients } from "../sampleData";
import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
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

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve:async (_:any, args:any)=>{
                const client = await new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return await client.save();
            }
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
                // name: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (_:any, args:any)=>{
                return await Client.deleteOne({_id: args.id});
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'}
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: {type: GraphQLNonNull(GraphQLID)}
            },
            async resolve(_:any, args:any){
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });

                return project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                projectId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve: async (_:any, args:any)=>{
                return await Project.findOneAndDelete({_id: args.projectId})
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                projectId: {type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectUpdateStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'}
                        }
                    })
                },
                clientId: {type: GraphQLString},
            },
            async resolve(_:any, args:any){
                return await Project.findOneAndUpdate({_id: args.projectId}, {name: args.name, description: args.description, status: args.status});
            }
        }
    }
});


export default new GraphQLSchema({
    query: RootQuery,
    mutation
})