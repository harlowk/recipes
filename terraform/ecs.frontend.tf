
resource "aws_ecs_service" "zeal_ecs_service_frontend" {
  name            = "zeal-ecs-service-frontend"                             # Naming our first service
  cluster         = "${aws_ecs_cluster.zeal_ecs_cluster.id}"             # Referencing our created Cluster
  task_definition = "${aws_ecs_task_definition.zeal_ecs_task_frontend.arn}" # Referencing the task our service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1 # Setting the number of containers we want deployed to 3

  load_balancer {
    target_group_arn = "${aws_lb_target_group.target_group_frontend.arn}" # Referencing our target group
    container_name   = "${aws_ecs_task_definition.zeal_ecs_task_frontend.family}"
    container_port   = 8080 # Specifying the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}", "${aws_default_subnet.default_subnet_c.id}"]
    assign_public_ip = true # Providing our containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Setting the security group to allow traffic to our containers
  }
}

resource "aws_ecs_task_definition" "zeal_ecs_task_frontend" {
  family                   = "zeal-ecs-task-frontend" # Naming our first task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "zeal-ecs-task-frontend",
      "image": "${aws_ecr_repository.ecr_repository_zeal.repository_url}:frontend-latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 512         # Specifying the memory our container requires
  cpu                      = 256         # Specifying the CPU our container requires
  execution_role_arn       = "${aws_iam_role.ecsTaskExecutionRole.arn}"
}