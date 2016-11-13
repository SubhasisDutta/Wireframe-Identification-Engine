# Steps to Setup EC2 instance

1. Create a EC2 Key Pair:
    Network & Security -> Key Pairs -> Create Key Pair
    Give Key Pair Name -> subhasisec2
    Save the .pem file -> Present in Documents folder
    (This is generated only once and is needed to acess the EC2 Instance)
2. Launch a EC2 instance:
    In EC2 dash board Create instance with Launch Instance click.
    Select the Ubuntu AMI
    Use t2.micro and click Configure Instance Details
    Keep default in Configure and move to Add Storage
    Change EB storege to 25 GB max 30 for Free use
    Add Tag
    Configure Security Group
    Add rule to allow HTTP from anywhere
    Review and Launch
    In key pair dialog -> Select Create a new key pair/ select an existing key pair
    The Launch Instance
3. Go to EC2 Console and check instance
4. SSH to instance
    To access your instance:
    Open an SSH client. 
    Locate your private key file (subhasisec2.pem). The wizard automatically detects the key you used to launch the instance.
    Your key must not be publicly viewable for SSH to work. Use this command if needed:
    chmod 400 subhasisec2.pem
    Connect to your instance using its Public DNS:
    ec2-35-160-238-107.us-west-2.compute.amazonaws.com
    Example:
    ssh -i "subhasisec2.pem" ubuntu@ec2-35-160-238-107.us-west-2.compute.amazonaws.com
    ssh -i "subhasisec2.pem" ubuntu@ip-172-31-34-187
    Please note that in most cases the username above will be correct, 
    however please ensure that you read your AMI usage instructions to 
    ensure that the AMI owner has not changed the default AMI username.
    
    