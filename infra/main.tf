# IaC: deliberately misconfigured demo resources. Do not apply.
resource "aws_s3_bucket" "demo" {
  bucket = "aikido-jenkins-demo-bucket"
}

resource "aws_s3_bucket_acl" "demo" {
  bucket = aws_s3_bucket.demo.id
  acl    = "public-read"
}

resource "aws_security_group" "ssh_open" {
  name = "ssh-open-to-world"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
