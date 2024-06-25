const serviceColors: { [key: string]: string } = {
    mysql: 'blue',
    redis: 'red',
};

const getColorForService = (serviceName: string): string => {
    if (serviceColors[serviceName]) {
        return serviceColors[serviceName];
    }

    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    serviceColors[serviceName] = randomColor;
    return randomColor;
};

export default getColorForService;
