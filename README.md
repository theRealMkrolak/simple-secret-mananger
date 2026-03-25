# Simple Secrets Manager

The problem this is trying to solve is to create a way to store credentials in an off site server and access them using a key. 
I know this problem is already by a bunch of other little projects but I wanted to play around with shadcn/ui, sqlLite and react.

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd secrets-manager

# Build and run the application
docker build -t secrets-manager .

# Run the application
docker run -d -p 8000:8000 secrets-manager
```


