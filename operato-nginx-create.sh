VERSION=latest

if [ $# -eq 0 ] ; then
  echo "Default Version latest"
else
  VERSION=$1
fi

echo "VERSION : ${VERSION}"

docker image build -t hatiolab/operato-nginx:${VERSION} -f nginx_Dockerfile .